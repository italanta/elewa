import { HandlerTools } from '@iote/cqrs';

import { Query } from '@ngfi/firestore-qbuilder';
import { FunctionHandler, HttpsContext, RestResult } from '@ngfi/functions';

import { EndUser } from '@app/model/convs-mgr/conversations/chats';
import { ChannelDataService } from '@app/functions/bot-engine';

import {
  MeasureGroupProgressCommand,
  ParticipantProgressMilestone,
  GroupProgressMilestone,
  GroupedParticipants,
  GroupProgressModel,
} from '@app/model/analytics/group-based/progress';

import { MonitoringAndEvaluationService } from '../data-services/monitoring.service';
import { MeasureParticipantProgressHandler } from './measure-participant-progress.handler';

/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 *
 * Can be used to create a stacjed bar chart which visualises the progress of a group of participants over time.
 */
export class MeasureParticipantGroupProgressHandler extends FunctionHandler<MeasureGroupProgressCommand, GroupProgressModel | RestResult> {
  /**
   * Calculate progress of a given participant based on the stories they have completed.e.
   * @param cmd - Command with participant ID and intervals at which to measure.
   */
  public async execute(cmd: MeasureGroupProgressCommand, context: HttpsContext,tools: HandlerTools) {
    try {
      const { interval } = cmd;

      // get OrgId from channel
      const channelDataService = new ChannelDataService(tools);

      const channels = await channelDataService.getChannels();

      const orgId = channels.orgId;

      // 1. Get all end users of org
      const userRepo = tools.getRepository<EndUser>(`orgs/${orgId}/end-users`);

      // TODO: @LemmyMwaura - pull groups from DB after user grouping feature is implemented.
      const endUsers = await userRepo.getDocuments(
        new Query().where('labels', 'array-contains-any', ['class_TBD','class_BDOM','class_HGRSJ',])
      );

      const engine = new MeasureParticipantProgressHandler();
      const monitoringAndEvalDataService = new MonitoringAndEvaluationService(tools, orgId);

      const allUsersProgress = await Promise.all(
        endUsers?.map((user) =>
          engine.execute({ orgId, participant: user, interval }, context, tools)
        )
      );

      // const time = interval | _getMilestoneTime();

      // 3. Combine the progress of each user into a group progress model
      return _groupProgress(allUsersProgress, monitoringAndEvalDataService);
    } catch (error) {
      tools.Logger.error(() => `[measureGroupProgressHandler].execute - Encountered an error ${error}`);
      return { error: error.message, status: 500 } as RestResult;
    }
  }
}

/**
 * Groups participant progress by milestone and group.
 * @param {Array} allUsersProgress - An array of participant progress milestone objects.
 */
async function _groupProgress(allUsersProgress: ParticipantProgressMilestone[],monitoringAndEvalDataService: MonitoringAndEvaluationService) {
  //1. group users by milestones
  const measurements = _groupUsersByMilestone(allUsersProgress);

  //2. group users by milestones and group
  const groupedMeasurements = _groupUsersByGroup(allUsersProgress);

  const time = new Date();
  const timeInUnix = Math.floor(time.getTime() / 1000);

  //4. Add To Database
  const savedMilestone = await monitoringAndEvalDataService.createNewMilestone(
    timeInUnix, measurements, groupedMeasurements, `m_${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`
  );

  return savedMilestone;
}

function _groupUsersByMilestone(allUsersProgress: ParticipantProgressMilestone[]) {
  const groupedByMilestone = allUsersProgress.reduce((acc, participant) => {
    const { milestone } = participant;

    if (!acc[milestone]) {
      acc[milestone] = [];
    }

    acc[milestone].push(participant);
    return acc;
  }, {});

  return _convertGroupedObjectsToArray(groupedByMilestone);
}

function _groupUsersByGroup(allUsersProgress: ParticipantProgressMilestone[]) {
  const groupedByGroupAndMilestone: GroupProgressMilestone[] = Object.values(allUsersProgress.reduce((acc, participant) => {
    const { group, milestone, participant: user } = participant;
  
    if (!acc[group]) {
      acc[group] = {
        name: group,
        measurements: {},
      };
    }
  
    if (!acc[group].measurements[milestone]) {
      acc[group].measurements[milestone] = {
        name: milestone,
        participants: [],
      };
    }
  
    acc[group].measurements[milestone].participants.push(user);
    return acc;
  }, {})).map((group: any)=> {
    group.measurements = Object.values(group.measurements);
    return group;
  });

  return groupedByGroupAndMilestone
}

/**
 * Converts a grouped object of participants into an array of objects with name and participants properties.
 * @param {Object} groupedData - An object where each key represents a group name and the value is an array of participant objects belonging to that group.
 * @returns {Array} An array of objects containing the name of the group and its corresponding array of participants.
 */
function _convertGroupedObjectsToArray(groupedData: GroupedParticipants): GroupProgressMilestone[] {
  return Object.keys(groupedData).map((key) => ({
    name: key,
    participants: groupedData[key],
  }));
}

function _getMilestoneTime() {
  const time = new Date();
  return Math.floor(time.getTime() / 1000);
}
