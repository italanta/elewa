import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';

import { CursorDataService, VariablesDataService } from '@app/functions/bot-engine';

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
    
    // 1.1. Get the user cursor at the measurement point.
    const latestCursor = interval
      ? (await cursorDataService.getUserCursorAtSetTime(interval, orgId, participant.id))?.cursor
  
      : ((await cursorDataService.getLatestCursor(participant.id, orgId)) as Cursor);

    const storyRepo = tools.getRepository<Story>(`orgs/${orgId}/stories`);

    // Get User's Name
    const varService = new VariablesDataService(tools, orgId, participant.id);

    const userName = await varService.getSpecificVariable(participant.id, 'name');

    // guard clause to filter user's with no cursor history when calculating past data
    if (!latestCursor) return

    const { storyId } = latestCursor.position

    const story = await storyRepo.getDocumentById(storyId);

    return {
      participant: {
        id: participant.id,
        name: userName ? userName : 'unknown',
        phone: participant.phoneNumber,
      },
      group: participant.labels ? participant.labels[0] : 'class_TBD',
      milestone: story.chapter,
      storyId: story.id,
    }
  }
}
