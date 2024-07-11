import { HandlerTools } from '@iote/cqrs';
import { RestResult } from '@ngfi/functions/v2';
import { FunctionHandler, FunctionContext } from '@ngfi/functions';
import { MicroAppProgress } from '@app/model/convs-mgr/micro-app/base';

/**
 * Handler responsible for updating user progress in micro-apps via a webhook callback.
 */
export class UpdateMicroAppProgressHandler extends FunctionHandler<MicroAppProgress, RestResult> 
{
  public async execute(req: any, context: FunctionContext, tools: HandlerTools): Promise<any> 
  {
    tools.Logger.log(() => `Received progress update callback`);

    const payload: MicroAppProgress = typeof req.body === 'string' ? JSON.parse(req.body) : req.body.data;

    tools.Logger.log(() => `Processing progress for app with ID ${payload.appId} for user ${payload.endUserId}`);
    
    try {
      const appRegistrationRepo$ = tools.getRepository<MicroAppProgress>('appProgress');
      const existingProgress = await appRegistrationRepo$.getDocumentById(payload.appId);

      if (existingProgress) {
        // Update existing progress
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
