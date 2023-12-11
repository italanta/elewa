import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, HttpsContext, RestResult } from '@ngfi/functions';

import {
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
  AnalyticsConfig,
} from '@app/model/analytics/group-based/progress';

import { MonitoringAndEvaluationService } from '../data-services/monitoring.service';
import { MeasureParticipantProgressHandler } from './measure-participant-progress.handler';

import { _getProgressCompletionRateData } from '../utils/get-completion- rate.util';

/**
 * Function which calculates progress of a given participant based on the stories they have completed.
 *
 * Can be used to create a stacjed bar chart which visualises the progress of a group of participants over time.
 */
export class MeasureParticipantGroupProgressHandler extends FunctionHandler<MeasureGroupProgressCommand, (GroupProgressModel | RestResult)[]> {
  /**
   * Calculate progress of a given participant based on the stories they have completed.e.
   * @param cmd - Command with participant ID and intervals at which to measure.
   */
  public async execute(cmd: MeasureGroupProgressCommand, context: HttpsContext, tools: HandlerTools) {
    const { interval } = cmd;

    //1. get OrgIds from analytics config
    const app = tools.getRepository<AnalyticsConfig>(`analytics`);

    const config = await app.getDocumentById('config');

    if (!config && !config.orgIds) {
      tools.Logger.error(() => `[measureGroupProgressHandler].execute - Config missing, No orgs to compute progress for`);
    } 

    else {
      const data = await Promise.all(config.orgIds.map((orgId) => _computeAnalyticsForOrg(tools, orgId, context, interval)))
      return data
    }
  }
}

async function _computeAnalyticsForOrg(tools: HandlerTools, orgId: string, context: HttpsContext, interval: number ) {
  try {
    tools.Logger.log(() => `[measureGroupProgressHandler].execute - Computing Progress for Org : ${orgId}`);
  
    const classroomDataService = new ClassroomDataService(tools, orgId);
  
    const endUserDataService = new EndUserDataService(tools, orgId);
  
    const enrUserDataService = new EnrolledUserDataService(tools, orgId);
  
    const classrooms = await classroomDataService.getClassrooms();
  
    // 2. Get all enrolled users of org
    const enrolledUsers = await enrUserDataService.getEnrolledUsers();
  
    // 3. Get all end users of an org, map end user to enrolled user's class
    const endUsersWithClassroom = await Promise.all(
      enrolledUsers
        .filter((user) => user.whatsappUserId).map(async (user) => {
          return {
            enrolledUser: user,
            endUser: await endUserDataService.getEndUser(user.whatsappUserId),
            classroom: classrooms.find((classroom) => classroom.id === user.classId),
          };
        })
    );
  
    tools.Logger.log(() => `[measureGroupProgressHandler].execute - EndUsers successfully fetched and grouped with classroom`);
  
    const engine = new MeasureParticipantProgressHandler();
  
    //4. get all users progress
    const allUsersProgress = await Promise.all(
      endUsersWithClassroom?.map((user) => {
          if (user.endUser) {
            return engine.execute({ orgId, participant: user, interval }, context, tools)
          }
        }
      )
    );
  
    // get the time/date for the measurement calculated in unix
    const timeInUnix = interval ? interval : _getCurrentDateInUnix();
  
    // 4. Combine the progress of each user into a group progress model
    return _groupProgress(allUsersProgress, timeInUnix, tools, orgId);
  } catch (error) {
    tools.Logger.error(() => `[measureGroupProgressHandler].execute - Encountered an error ${error}`);
    return { error: error.message, status: 500 } as RestResult;
  }
}

/**
 * Groups participant progress by milestone and group.
 * @param {Array} allUsersProgress - An array of participant progress milestone objects.
 */
async function _groupProgress(allUsersProgress: ParticipantProgressMilestone[], timeInUnix:number, tools: HandlerTools, orgId: string) {
  tools.Logger.log(() => `[measureGroupProgressHandler].execute - Start grouping allusersProgress`);

  const monitoringDataServ = new MonitoringAndEvaluationService(tools, orgId);

  const enrolledUserDataServ = new EnrolledUserDataService(tools, orgId);

  //1. group users by milestones
  const measurements = _parseAllUserProgressData(allUsersProgress);

  //2. group users by milestones and classroom
  const groupedMeasurements = _parseGroupedProgressData(allUsersProgress);

  //3. calc progress completion rate.
  const progressCompletion = _getProgressCompletionRateData(allUsersProgress);

  tools.Logger.log(() => `[measureGroupProgressHandler].execute - Progress Successfully Grouped`);

  const date = new Date(timeInUnix);

  //3. get newly Enrolled User Count
  const enrolledUserCount = await getEnrolledUserCreationCount(enrolledUserDataServ, orgId, tools, timeInUnix);

  //4. Add To Database
  const savedMilestone = await monitoringDataServ.createNewMilestone(
    timeInUnix,
    measurements,
    groupedMeasurements,
    enrolledUserCount,
    progressCompletion,
   `m_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  );

  return savedMilestone;
}

/**
 * Gets the number of enrolled users created today, in the past week (if it's friday), and in the past month (if end of month).
 * @param {enrolledUserDataServ} enrolledUserDataServ - The enrolled user data service.
 * @param {string} orgId - The organization ID.
 */
async function getEnrolledUserCreationCount(enrolledUserDataServ: EnrolledUserDataService, orgId: string, tools:HandlerTools, timeInUnix:number) {
  const timeToCollect = new Date(timeInUnix);
  const dayOfWeek = timeToCollect.getDay(); // 0 = Sunday, 1 = Monday, ...
  const isLastDayOfMonth = new Date(timeToCollect.getFullYear(), timeToCollect.getMonth() + 1, 0).getDate() === timeToCollect.getDate();

  const dailyCount = (await enrolledUserDataServ.getSpecificDayUserCount(orgId, timeInUnix)).length;

  let pastWeekCount = 0;
  let pastMonthCount = 0;

  if (dayOfWeek === 5) { // Friday (0-based index, where 5 represents Friday)
    pastWeekCount = (await enrolledUserDataServ.getPastWeekUserCount(orgId, timeInUnix)).length;
  }

  if (isLastDayOfMonth) {
    pastMonthCount = (await enrolledUserDataServ.getPastMonthUserCount(orgId, timeInUnix)).length;
  }

  tools.Logger.log(() => `[measureGroupProgressHandler].execute - Enrolled user creation count completed`);

  return {
    dailyCount,
    pastWeekCount,
    pastMonthCount
  }
}

/**
 * Groups users by milestone(current Module) in their progress.
 * @param {ParticipantProgressMilestone[]} allUsersProgress - The array of participants' progress milestones.
 * @returns {UsersProgressMilestone[]} An array of participants grouped by milestone.
 */
function _parseAllUserProgressData(allUsersProgress: ParticipantProgressMilestone[]): UsersProgressMilestone[] {
  const groupedByMilestone = allUsersProgress.reduce((acc, participant) => {
    //guard clause to filter user's with no history when calculating past data
    if (!participant) return acc;

    const { courseId } = participant;

    if (!acc[courseId]) {
      acc[courseId] = [];
    }

    acc[courseId].push(participant);
    return acc;
  }, {});

  return _convertGroupedObjectsToArray(groupedByMilestone);
}


/**
 * Groups users by course then by classroom, then by milestone(current module) in their progress.
 * @param {ParticipantProgressMilestone[]} allUsersProgress - The array of participants' progress milestones.
 * @returns {GroupedProgressMilestone[]} An array of participants grouped by course, class then by milestone.
 */
function _parseGroupedProgressData(allUsersProgress: ParticipantProgressMilestone[]): GroupedProgressMilestone[] {
  const groupedByGroupAndMilestone = Object.values(allUsersProgress.reduce((acc, participant) => {
      //guard clause to filter user's with no history when calculating past data
      if (!participant) return acc;

      const { classroom, milestoneId, courseId, participant: user } = participant;

      if (!acc[courseId]) {
        acc[courseId] = {
          id: courseId,
          classrooms: {},
        };
      }

      if (!acc[courseId].classrooms[classroom.id]) {
        acc[courseId].classrooms[classroom.id] = {
          id: classroom.id,
          measurements: {},
        };
      }

      if (!acc[courseId].classrooms[classroom.id].measurements[milestoneId]) {
        acc[courseId].classrooms[classroom.id].measurements[milestoneId] = {
          id: milestoneId,
          participants: [],
        };
      }

      acc[courseId].classrooms[classroom.id].measurements[milestoneId].participants.push(user);
      return acc;
    }, {})
  ).map((group: GroupedProgressMilestone) => {
    group.classrooms = Object.values(group.classrooms).map((classroom) => {
      classroom.measurements = Object.values(classroom.measurements);
      return classroom;
    });

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
    id: key,
    participants: groupedData[key],
  }));
}

/** get current Date in unix */
function _getCurrentDateInUnix() {
  const time = new Date();
  return Math.floor(time.getTime());
}
