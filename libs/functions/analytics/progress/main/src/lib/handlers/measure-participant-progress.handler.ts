import { HandlerTools, Repository } from '@iote/cqrs';

import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';

import { CursorDataService } from '@app/functions/bot-engine';

import { MeasureProgressCommand, ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress'

/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 */
export class MeasureParticipantProgressHandler extends FunctionHandler<MeasureProgressCommand, ParticipantProgressMilestone>
{
  /**
   * Calculate progress of a given participant based on the stories they have completed.e.
   * 
   * @param cmd - Command with participant ID and intervals at which to measure.
   */
  public async execute(cmd: MeasureProgressCommand, context: HttpsContext, tools: HandlerTools) 
  {
    const { orgId , participant, interval } = cmd;

    // 1. Get latest chat at each interval in time to measure progress
    // const cursorRepo = tools.getRepository<Cursor>(`orgs/${orgId}/end-users/${participant.id}/cursor`);
    
      // 1.1. Get the user cursor at each measurement point.
    const cursorDataService = new CursorDataService(tools)

    const latestCursor = await cursorDataService.getLatestCursor(participant.id, orgId)  as Cursor

    const storyRepo = tools.getRepository<Story>(`orgs/${orgId}/stories`);

    const { storyId } = latestCursor.position

    const story = await storyRepo.getDocumentById(storyId);

    return {
      participant: {
        id: participant.id,
        name: participant.name || 'unknown',
        phone: participant.phoneNumber,
      },
      group: participant.labels[0],
      milestone: story.chapter,
      storyId: story.id,
    }
  }
}

/**
 * Gets the latest message which was sent to a user at the time of measurement.
 * 
 * @param timeToMeasure - Unix time when to take a measurement
 * @param repo          - Repository to use to find the cursor
 * @returns 
 */
async function _getLatestMessageAtEachInterval(unixToMeasure: number, cursorRepo: Repository<Cursor>)
{
  // Convert unix time to date
  const timeToMeasure = new Date(unixToMeasure * 1000);

  // Get latest message before the measurement time to show progress of user at that time
  const query = new Query()
                      .where('createdOn', '<=', timeToMeasure)
                      .orderBy('createdOn', 'desc')
                  .limit(1);

  const crsors$ = await cursorRepo.getDocuments(query);

  const cursor = crsors$.length > 0 ? crsors$[0] : null;

  return { time: unixToMeasure, position: cursor };
}
