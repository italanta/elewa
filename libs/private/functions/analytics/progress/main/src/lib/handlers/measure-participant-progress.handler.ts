import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { defaultClassroom } from '@app/model/convs-mgr/classroom';

import { CursorDataService, VariablesDataService, BotModuleDataService } from '@app/functions/bot-engine';

import { MeasureProgressCommand, ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress'

/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 */
export class MeasureParticipantProgressHandler extends FunctionHandler<MeasureProgressCommand, ParticipantProgressMilestone>
{
  /**
   * Calculate progress of a given participant based on the stories they have completed.
   * 
   * @param cmd - Command with participant ID and an optional interval at which to measure - defaults to current date.
   */
  public async execute(cmd: MeasureProgressCommand, context: HttpsContext, tools: HandlerTools) 
  {
    const { orgId , participant, interval } = cmd;

    const cursorDataService = new CursorDataService(tools)

    const botModDataService = new BotModuleDataService(tools, orgId);

    // 1.1. Get the user cursor at the measurement point.
    const latestCursor = interval
      ? (await cursorDataService.getUserCursorAtSetTime(interval, orgId, participant.endUser.id))?.cursor
  
      : ((await cursorDataService.getLatestCursor(participant.endUser.id, orgId)) as Cursor);

    const storyRepo = tools.getRepository<Story>(`orgs/${orgId}/stories`);

    // Get User's Name
    const varService = new VariablesDataService(tools, orgId, participant.endUser.id);

    const userName = await varService.getSpecificVariable(participant.endUser.id, 'name');

    // guard clause to filter user's with no cursor history when calculating past data
    if (!latestCursor) return

    const { storyId } = latestCursor.position

    const story = await storyRepo.getDocumentById(storyId);

    const parentModule = await botModDataService.getBotModule(story.parentModule);

    return {
      participant: {
        id: participant.endUser.id,
        name: userName ? userName : 'unknown',
        phone: participant.endUser.phoneNumber,
        dateCreated: participant.enrolledUser.createdOn,
      },
      classroom: participant.classroom ?? defaultClassroom,
      milestoneId: story.parentModule,
      courseId: parentModule.parentBot,
      storyId: story.id,
    }
  }
}
