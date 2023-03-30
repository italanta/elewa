import { HandlerTools, Repository } from '@iote/cqrs';

import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { Story } from '@app/model/convs-mgr/stories/main';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';

import { MeasureProgressCommand } from '@app/model/analytics/class-based/progress';
import { Query } from '@ngfi/firestore-qbuilder';


/**
 * Capture a measurement of participants progress at a certain point in time.
 */
export class MeasureParticipantProgressHandler extends FunctionHandler<MeasureProgressCommand, RestResult>
{
  /**
   * Capture a measurement of participants progress at a certain point in time.
   * 
   * @param payload - Command with participant ID and intervals at which to measure.
   */
  public async execute(payload: MeasureProgressCommand, context: HttpsContext, tools: HandlerTools) 
  {
    const{ orgId , participantId, interval } = payload;

    // 1. Get end user
    const userRepo = tools.getRepository<EndUser>(`orgs/${orgId}/end-users`); 
    const endUser = await userRepo.getDocumentById(participantId);

    // 2. Get latest chat at each interval in time to measure progress
    const cursorRepo = tools.getRepository<Message>(`orgs/${orgId}/end-users/${participantId}/cursor`);
    
      // 2.1. Get the user cursor at each measurement point.
    const userProgressAtTime
      = await Promise.all(
          interval.map(async (unixTime) => 
             _getLatestMessageAtEachInterval(unixTime, cursorRepo)
          ));

      // 2.2 Get the story information for each of the stories the user visited while on the cursor.
    const qualifiedStories = new Set(userProgressAtTime.map((p) => p.position.storyId));
    const storyRepo = tools.getRepository<Story>(`orgs/${orgId}/stories`);

    const storyQuery = new Query().where('id', 'in', Array.from(qualifiedStories));
    const stories = await storyRepo.getDocuments(storyQuery);
    
      // 2.3. Combine cursors and their stories
    const userProgress 
      = userProgressAtTime.map((p) => ({ p, story: stories.find((s) => s.id === p.position.storyId)}));
    
    // 3. Create the progress model, visualising this data

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
                  .where('timestamp', '<=', timeToMeasure)
                  .orderBy('timestamp', 'desc')
                  .limit(1);

  const crsors$ = await cursorRepo.getDocuments(query);

  const cursor = crsors$.length > 0 ? crsors$[0] : null;

  return { time: unixToMeasure, position: cursor };
}

/**
 * Function which shows progress of participants in a group based on the stories they have completed.
 * 
 * @param participants - List of participants
 * @param stories      - List of stories through which the participants are moving
 * @param interval     - Collection of dates at which time to measure progress
 */
export function __MeasureParticipantsProgress(participants: EndUser[], stories: Story[], interval: Date[]) : GroupBasedProgressModel
{

}

  /** 
   * Measure the progress of a participant on a certain day.
   * 
   * @param participant - Participant to measure progress of
   * @param stories     - List of stories through which the participant is moving
   * @param day         - Day at which to measure progress
   */
  export function __ProgressOfParticipantOnDay(participant: EndUser, stories: Story[], day: Date)
  {

  }
