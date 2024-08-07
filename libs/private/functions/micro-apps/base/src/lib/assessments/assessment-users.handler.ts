import { getFirestore } from 'firebase-admin/firestore';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

import { AssessmentProgress, AssessmentStatusTypes, AssessmentUserResultResponse, AssessmentUserResults } from '@app/model/convs-mgr/micro-app/assessments';

/**
 * Handler responsible for initiation micro-apps based on the passed micro-app ID.
 */
export class AssessmentUsersHandler extends FunctionHandler<{id: string}, AssessmentUserResultResponse>
{
  public async execute(req: {id: string}, context: FunctionContext, tools: HandlerTools): Promise<AssessmentUserResultResponse>
  {
    tools.Logger.log(() => `Fetching results for assessment with ID ${req.id}`)

    try 
    {
      const db = getFirestore();

      const querySnapshot = await db.collectionGroup('assessment-progress').where('id', '==', req.id).get();

      const progress = querySnapshot.docs.map(doc => doc.data()) as AssessmentProgress[];

      const results = this._mapUsersDetails(progress);

      return {
        success: true,
        results
      } as AssessmentUserResultResponse;
      
    } 
    catch (error) {
      tools.Logger.error(() => `[InitMicroAppHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return {
        success: false,
        error: JSON.stringify(error)
      } as AssessmentUserResultResponse;
    }
  }

  private _mapUsersDetails(progress: AssessmentProgress[]): AssessmentUserResults[] {
    return progress // Only show completed results
            .filter((p)=> p.attempts[p.attemptCount].outcome !== AssessmentStatusTypes.Incomplete)
                .map((pg)=> {
                  const latestAttempt = pg.attempts[pg.attemptCount];

                  return {
                    name: pg.endUserName,
                    phoneNumber: pg.endUserId.split('_')[2],
                    dateDone: new Date(latestAttempt.finishedOn),
                    score: Math.round((latestAttempt.score / pg.maxScore) * 100),
                    scoreCategory: latestAttempt.outcome
                  }
                })
  }

}


