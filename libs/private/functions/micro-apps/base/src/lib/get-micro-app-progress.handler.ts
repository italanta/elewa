import { HandlerTools } from '@iote/cqrs';
import { RestResult } from '@ngfi/functions/v2';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { MicroAppProgress } from '@app/model/convs-mgr/micro-app/base';
import { AssessmentResult } from '@app/model/convs-mgr/micro-app/assessments';

/**
 * Handler responsible for updating user progress in micro-apps via a webhook callback.
 */
export class UpdateMicroAppProgressHandler extends FunctionHandler<MicroAppProgress, RestResult> 
{
  public async execute(req: MicroAppProgress, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    const payload = req;
    
    tools.Logger.log(() => `Received progress update callback`);

    tools.Logger.log(() => `Processing progress for app with ID ${payload.appId} for user ${payload.endUserId}`);
    
    try {
      const assessmentResultsRepo$ = tools.getRepository<AssessmentResult>(`orgs/${req.orgId}/end-users/${req.endUserId}/assessment-results`);
      const existingProgress = await assessmentResultsRepo$.getDocumentById(req.appId);

      if (existingProgress) {
        const currentAttempt = existingProgress.attempts.get(existingProgress.attemptCount);
        // Update existing progress

        const myArray = Array.from(myMap);
        const lastItem = myArray[myArray.length - 1];
        existingProgress.milestones.questionId = payload.milestones.questionId;
        existingProgress.milestones.timeSpent = payload.milestones.timeSpent;
        await appRegistrationRepo$.update(existingProgress);
      } else {
        // Create new progress entry
        await appRegistrationRepo$.create(payload);
      }

      return { status: 200 } as RestResult;
    } catch (error) {
      tools.Logger.error(() => `[UpdateMicroAppProgressHandler].execute - Encountered error :: ${JSON.stringify(error)}`);
      return { success: false, error: JSON.stringify(error) };
    }
  }
}
