import { getFirestore } from 'firebase-admin/firestore';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';

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

      return {
        success: true,
        results
      } as AssessmentResultResponse;
      
    } 
    catch (error) {
      tools.Logger.error(() => `[InitMicroAppHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return {
        success: false,
        error: JSON.stringify(error)
      } as AssessmentResultResponse;
    }
  }

}


