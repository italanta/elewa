import { HandlerTools } from '@iote/cqrs';

import { FunctionHandler, HttpsContext } from '@ngfi/functions';

import {
  CursorDataService,
  VariablesDataService,
  BotModuleDataService,
  StoriesDataService,
} from '@app/functions/bot-engine';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { defaultClassroom } from '@app/model/convs-mgr/classroom';
import { EnrolledEndUser, EnrolledUserBotModule } from '@app/model/convs-mgr/learners';

import { MeasureProgressCommand, ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress';
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

    const storiesDataService = new StoriesDataService(tools, orgId);

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

    const progress = await _computeLearnerProgress(participant.enrolledUser, storiesDataService);

    return {
      participant: {
        id: participant.endUser.id,
        name: userName ? userName : 'unknown',
        phone: participant.endUser.phoneNumber,
        dateCreated: participant.enrolledUser.createdOn,
        progress,
      },
      classroom: participant.classroom ?? defaultClassroom,
      milestoneId: story.parentModule,
      courseId: parentModule.parentBot,
      storyId: story.id,
    }
  }
}

/** get learner progress */
const _computeLearnerProgress = async (enrolledUser: EnrolledEndUser, storiesDataService: StoriesDataService) => {
  const coursePromises = enrolledUser?.courses?.map( async(course) => {
    const modulePromises = course.modules.map(
      (moduleProg) => _calculateProgress(moduleProg, storiesDataService)
    )

    return {
      courseId: course.courseId,
      modules: await Promise.all(modulePromises)
    }
  })

  const courses = await Promise.all(coursePromises);
  return courses;
}

const _calculateProgress = async (moduleProg: EnrolledUserBotModule, storiesDataService: StoriesDataService) => {
  const lessonPromises = moduleProg.lessons.map(async (lessonProg) => {
    const story = await storiesDataService.getStory(lessonProg.lessonId);

    const totalBlocks = story?.blocksCount ? story.blocksCount - 2 : 0; // subtract start and end anchor
    const blockedPassed = lessonProg?.blocks.length ?? 0;
    const percentage = totalBlocks === 0 ? 0 : (blockedPassed / totalBlocks) * 100;

    return {
      lessonId: lessonProg.lessonId,
      progress: Math.round(percentage),
    };
  })

  return {
    moduleId: moduleProg.moduleId,
    lessons: await Promise.all(lessonPromises),
  }
}
