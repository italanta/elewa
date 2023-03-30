import { HandlerTools, Repository } from '@iote/cqrs';

import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import { Story } from '@app/model/convs-mgr/stories/main';

import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';

import { MeasureProgressCommand, ParticipantProgressModel, ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress'

/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 */
export class MeasureParticipantProgressHandler extends FunctionHandler<MeasureProgressCommand, ParticipantProgressModel>
{
  /**
   * Calculate progress of a given participant based on the stories they have completed.e.
   * 
   * @param cmd - Command with participant ID and intervals at which to measure.
   */
  public async execute(cmd: MeasureProgressCommand, context: HttpsContext, tools: HandlerTools) 
  {
    const{ orgId , participantId, interval, storyGroupIdentifier } = cmd;

    // 1. Get latest chat at each interval in time to measure progress
    const cursorRepo = tools.getRepository<Cursor>(`orgs/${orgId}/end-users/${participantId}/cursor`);
    
      // 1.1. Get the user cursor at each measurement point.
    const userProgressAtTime
      = await Promise.all(
          interval.map(async (unixTime) => 
             _getLatestMessageAtEachInterval(unixTime, cursorRepo)
          ));

      // 1.2 Get the story information for each of the stories the user visited while on the cursor.
    const qualifiedStories = new Set(userProgressAtTime.map((p) => p.position.position.storyId));
    const storyRepo = tools.getRepository<Story>(`orgs/${orgId}/stories`);

    const storyQuery = new Query().where('id', 'in', Array.from(qualifiedStories));
    const stories = await storyRepo.getDocuments(storyQuery);
    
      // 1.3. Combine cursors and their stories
    const userProgress 
      = userProgressAtTime.map((p) => ({ p, story: stories.find((s) => s.id === p.position.position.storyId)}));
    
    // 2. Create the progress model, visualising this data

    if(storyGroupIdentifier)
    {
      return _groupedUserProgress(participantId, userProgress, storyGroupIdentifier);
    }

    return _userProgress(participantId, userProgress);
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

/** Visualise user progress story to story */
function _userProgress(uid: string, progress: UserPositionStub[]) : ParticipantProgressModel
{
  const milestones = progress.map((p) => ({ time: p.p.time, milestone: p.story.name, storyId: p.story.id }) as ParticipantProgressMilestone)
                             .sort(p => p.time);

  return { 
    userId: uid,
    milestones
  };
}

/** visualise user progress per milestone (grouped story/labelled story)  */
function _groupedUserProgress(uid: string, progress: UserPositionStub[], groupByLblIndex: boolean)
{
  const milestones = progress.map((p) => ({ time: p.p.time, 
                                            milestone: (groupByLblIndex && p.story.labels) ? p.story.labels[0] 
                                                                                           : 'unlabeled', 
                                            storyId: p.story.id }) as ParticipantProgressMilestone)
                             .sort(p => p.time);

  return { 
    userId: uid,
    milestones 
  } ;
}

/** Temp structure to group user positions */
interface UserPositionStub
{ 
  p: { time: number;  position: Cursor; } 
  story: Story; 
}