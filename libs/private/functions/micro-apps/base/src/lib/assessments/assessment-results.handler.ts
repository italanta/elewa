import { getFirestore } from 'firebase-admin/firestore';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { Query } from '@ngfi/firestore-qbuilder';

import { GroupProgressModel } from '@app/model/analytics/group-based/progress';
import { AssessmentProgress, AssessmentResultResponse } from '@app/model/convs-mgr/micro-app/assessments';

import { calculateAssessmentResult } from '../utils/assessment-results-calculations.util';

/**
 * Handler responsible for initiation micro-apps based on the passed micro-app ID.
 */
export class AssessmentResultHandler extends FunctionHandler<{id: string}, AssessmentResultResponse>
{
  public async execute(req: {id: string}, context: FunctionContext, tools: HandlerTools): Promise<AssessmentResultResponse>
  {
    tools.Logger.log(() => `Fetching results for assessment with ID ${req.id}`)

    try 
    {
      const db = getFirestore();

      const querySnapshot = await db.collectionGroup('assessment-progress').where('id', '==', req.id).get();

      const progress = querySnapshot.docs.map(doc => doc.data()) as AssessmentProgress[];

      const results = calculateAssessmentResult(progress);

      const orgId = progress[0].orgId;

      const analytics$ = db.collection(`orgs/${orgId}/monitoring`);

      const latestAnalyticsQuery = await analytics$.orderBy("time", "desc").limit(1).get();

      const latestAnalytics = latestAnalyticsQuery.docs.map(doc => doc.data()) as GroupProgressModel[];

      if(latestAnalytics && latestAnalytics.length > 0) {
        const botId = progress[0].botId;

        if(botId) {
          const totalUsersInCourse = latestAnalytics[0].courseProgress[botId].totalUsers.dailyCount;

          results.pieChartData.notStarted = totalUsersInCourse - (results.pieChartData.done + results.pieChartData.inProgress);
        }
      } else {
        tools.Logger.error(() => `[AssessmentResultHandler].execute - No analytics for org ${orgId}. The results might be incomplete`);
      }
      
      return {
        success: true,
        results
      } as AssessmentResultResponse;
      
    } 
    catch (error) {
      tools.Logger.error(() => `[AssessmentResultHandler].execute - Encountered error :: ${error}`);
      return {
        success: false,
        error: JSON.stringify(error)
      } as AssessmentResultResponse;
    }
  }

}


