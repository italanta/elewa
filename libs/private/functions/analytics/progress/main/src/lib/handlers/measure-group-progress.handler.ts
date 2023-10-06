import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext, RestResult } from '@ngfi/functions';

import {
  ChannelDataService,
  ClassroomDataService,
  EndUserDataService,
  EnrolledUserDataService,
} from '@app/functions/bot-engine';

import {
  MeasureGroupProgressCommand,
  ParticipantProgressMilestone,
  GroupedParticipants,
  GroupProgressModel,
  UsersProgressMilestone,
  GroupedProgressMilestone,
} from '@app/model/analytics/group-based/progress';
import { Classroom } from '@app/model/convs-mgr/classroom';

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

      //1. get OrgId from channel
      const channelDataService = new ChannelDataService(tools);

      const channels = await channelDataService.getChannels();

      const orgId = channels.orgId;

      const classroomDataService = new ClassroomDataService(tools, orgId);

      const endUserDataService = new EndUserDataService(tools, orgId);

      const enrUserDataService = new EnrolledUserDataService(tools, orgId);

      const classrooms = await classroomDataService.getClassrooms();

      // 2. Get all enrolled users of org
      const enrolledUsers = await enrUserDataService.getEnrolledUsers();

      // 3. Get all end users of an org, map end user to enrolled user's class
      const endUsers = await Promise.all(
        enrolledUsers
          .filter((user) => user.whatsappUserId).map(async (user) => {
            return {
              endUser: await endUserDataService.getEndUser(user.whatsappUserId),
              classroom: classrooms.find((classroom) => classroom.id === user.classId) as Classroom,
            };
          })
      );

      const engine = new MeasureParticipantProgressHandler();

      const monitoringAndEvalDataService = new MonitoringAndEvaluationService(tools, orgId);

      //4. get all users progress
      const allUsersProgress = await Promise.all(
        endUsers?.map((user) =>
          engine.execute({ orgId, participant: user, interval }, context, tools)
        )
      );

      // get the time/date for the measurement calculated in unix
      const timeInUnix = interval ? interval : _getCurrentDateInUnix();

      // 4. Combine the progress of each user into a group progress model
      return _groupProgress(allUsersProgress, monitoringAndEvalDataService, timeInUnix);
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
async function _groupProgress(allUsersProgress: ParticipantProgressMilestone[], monitoringDataServ: MonitoringAndEvaluationService, timeInUnix:number) {
  //1. group users by milestones
  const measurements = _groupUsersByMilestone(allUsersProgress);

  //2. group users by milestones and group
  const groupedMeasurements = _groupUsersByGroupThenMilestone(allUsersProgress);

  const date = new Date(timeInUnix * 1000);

  //3. Add To Database
  const savedMilestone = await monitoringDataServ.createNewMilestone(
    timeInUnix, measurements, groupedMeasurements, `m_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  );

  return savedMilestone;
}

/**
 * Groups users by milestone in their progress.
 * @param {ParticipantProgressMilestone[]} allUsersProgress - The array of participants' progress milestones.
 * @returns {UsersProgressMilestone[]} An array of participants grouped by milestone.
 */
function _groupUsersByMilestone(allUsersProgress: ParticipantProgressMilestone[]): UsersProgressMilestone[] {
  const groupedByMilestone = allUsersProgress.reduce((acc, participant) => {
    //guard clause to filter user's with no history when calculating past data
    if (!participant) return acc;

    const { milestone } = participant;

    if (!acc[milestone]) {
      acc[milestone] = [];
    }

    acc[milestone].push(participant);
    return acc;
  }, {});

  return _convertGroupedObjectsToArray(groupedByMilestone);
}


/**
 * Groups users by course then by classroom, then by milestone in their progress.
 * @param {ParticipantProgressMilestone[]} allUsersProgress - The array of participants' progress milestones.
 * @returns {GroupedProgressMilestone[]} An array of participants grouped by course, class then by milestone.
 */
function _groupUsersByGroupThenMilestone(allUsersProgress: ParticipantProgressMilestone[]): GroupedProgressMilestone[] {
  const groupedByGroupAndMilestone = Object.values(allUsersProgress.reduce((acc, participant) => {
      //guard clause to filter user's with no history when calculating past data
      if (!participant) return acc;

      const { classroom, milestone, course, participant: user } = participant;

      if (!acc[course]) {
        acc[course] = {
          name: course,
          measurements: {},
        };
      }

      if (!acc[course].classrooms[classroom.className]) {
        acc[course].classrooms[classroom.className] = {
          name: classroom.className,
          measurements: {},
        };
      }

      if (!acc[course].classrooms[classroom.className].measurements[milestone]) {
        acc[course].classrooms[classroom.className].measurements[milestone] = {
          name: milestone,
          participants: [],
        };
      }

      acc[course].classrooms[classroom.className].measurements[milestone].participants.push(user);
      return acc;
    }, {})
  ).map((group: GroupedProgressMilestone) => {
    group.measurements = Object.values(group.measurements);
    return group;
  });

  return groupedByGroupAndMilestone;
}

/**
 * Converts a grouped object of participants into an array of objects with name and participants properties.
 * @param {Object} groupedData - An object where each key represents a group name and the value is an array of participant objects belonging to that group.
 * @returns {Array} An array of objects containing the name of the group and its corresponding array of participants.
 */
function _convertGroupedObjectsToArray(groupedData: GroupedParticipants): UsersProgressMilestone[] {
  return Object.keys(groupedData).map((key) => ({
    name: key,
    participants: groupedData[key],
  }));
}

/** get current Date in unix */
function _getCurrentDateInUnix() {
  const time = new Date();
  return Math.floor(time.getTime() / 1000);
}
