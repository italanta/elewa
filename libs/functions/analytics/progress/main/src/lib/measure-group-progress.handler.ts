import { cloneDeep as ___cloneD } from 'lodash';
import { HandlerTools } from '@iote/cqrs';

import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, HttpsContext, RestResult } from '@ngfi/functions';

import { EndUser } from '@app/model/convs-mgr/conversations/chats';

import { 
  MeasureGroupProgressCommand, GroupProgressModel, 
  ParticipantProgressModel, ParticipantProgressMilestone, 
  GroupProgressMilestone, GroupProgressMeasurement 
} from '@app/model/analytics/group-based/progress'

import { MeasureParticipantProgressHandler } from './measure-participant-progress.handler';

/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 * 
 * Can be used to create a stacjed bar chart which visualises the progress of a group of participants over time.
 */
export class MeasureParticipantGroupProgressHandler extends FunctionHandler<MeasureGroupProgressCommand, GroupProgressModel | RestResult>
{
  /**
   * Calculate progress of a given participant based on the stories they have completed.e.
   * 
   * @param cmd - Command with participant ID and intervals at which to measure.
   */
  public async execute(cmd: MeasureGroupProgressCommand, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      const{ orgId , participantGroupIdentifier, interval, storyGroupIdentifier } = cmd;
        
      // 1. Get all end users of org
      const userRepo = tools.getRepository<EndUser>(`orgs/${orgId}/end-users`); 

      // If we are only interested in a group of participants, then we need to filter the users by the group identifier.
      const usersOfGroupQ = getParticipantsQuery(participantGroupIdentifier);

      const endUsers = await userRepo.getDocuments(usersOfGroupQ);    
  
      // 2. Get the progress of each end user
      const engine = new MeasureParticipantProgressHandler();

      const userProgress = await Promise.all(
        endUsers.map((u) =>
          engine.execute({ orgId, participantId: u.id, interval, storyGroupIdentifier }, context, tools)));
      
      // 3. Combine the progress of each user into a group progress model
      return _groupProgress(interval, endUsers, userProgress);

    } catch(error) {
      tools.Logger.error(() => `[measureGroupProgressHandler].execute - Encountered an error ${error}`);
      return { error: error.message, status: 500} as RestResult
    }
  }
}

function getParticipantsQuery(participantGroupIdentifier: string) {
  if (participantGroupIdentifier === 'all') {
    return new Query().where('labels', 'in', ['class_TBD', 'class_BDOM'])
  } else {
    return new Query().where('labels', 'array-contains', participantGroupIdentifier)
  }
}

function _groupProgress(intervals: number[], users: EndUser[], userProgress: ParticipantProgressModel[]): GroupProgressModel
{
  const milestones = _openingMilestones(userProgress);

  return {
    measurements: intervals.map((m) => _milestonesForMeasurement(m, users, userProgress, milestones))
  };
}

/**
 * Create a stacked measurement for a single time interval
 */
function _milestonesForMeasurement(measurement: number, users: EndUser[], data: ParticipantProgressModel[], milestones: GroupProgressMilestone[]) : GroupProgressMeasurement
{
  const template =  ___cloneD(milestones);
  // Fill out the data for the template (number of users at the milestones at the given time)
  for(const milestone of template)
  {
    const participants = data.filter(d => d.milestones.find(f => f.time === measurement && f.milestone === milestone.milestone));
    
    milestone.participants = participants.map(p =>
    { 
      const user =  users.find(u => u.id === p.userId)
      return { id: p.userId, name: user.name, phone: user.phoneNumber };
    });

    milestone.nParticipants = participants.length;
  }

  return {
    time: measurement,
    milestones: template
  };
}

/**
 * Starting structure for a measurement in time.
 */
function _openingMilestones(userProgress: ParticipantProgressModel[]): GroupProgressMilestone[]
{
  // Get all possible milestones
  const allMilestones = userProgress.map((p) => p.milestones.map(m => m.milestone))
                                    .flat();
  // Remove duplicate
  const uniqueMilestones = new Set(allMilestones);

  // Return as list
  return Array.from(uniqueMilestones)
              .map((m) => 
  ({ 
    milestone: m, 
    storyId: _findFirstStory(m, userProgress),
    participants: [],
    nParticipants: 0
  }) as GroupProgressMilestone);
}
  
  function _findFirstStory(milestone: string, userProgress: ParticipantProgressModel[]): string
  {
    const firstUser = userProgress.find((u) => u.milestones.find((m) => m.milestone === milestone));

    if(!firstUser) 
      return 'story-unknown';

    return firstUser.milestones.find((m) => m.milestone === milestone).storyId;
  }
