import { HandlerTools } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

import { EnrolledUserDataService } from "../services/data-services/enrolled-user.service";
import { BotModuleDataService } from "../services/data-services/botmodules.service";
import { StoriesDataService } from "../services/data-services/stories.service";

/** update the enrolled user's progress with the just completed story(lesson's) details*/
export async function updateLearnerProgress (currentStory: string, lastBlock:StoryBlock, endUser:EndUser, tools:HandlerTools, orgId:string) {
  const enrolledDataServ = new EnrolledUserDataService(tools, orgId);
  const botModDataService = new BotModuleDataService(tools, orgId);
  const storiesDataService = new StoriesDataService(tools, orgId);

  const enrolledUser = await enrolledDataServ.getEnrolledUser(endUser.enrolledUserId ?? '');

  const parentModule = (await storiesDataService.getStory(currentStory))?.parentModule;
  const parentCourse = (await botModDataService.getBotModule(parentModule))?.parentBot;

  if (!enrolledUser) return;

  if (enrolledUser.courses == null) enrolledUser.courses = [];

  // Find or create the course
  let theCourse = enrolledUser.courses.find(course => course.courseId === parentCourse);

  if (!theCourse) {
    theCourse = { courseId: parentCourse, modules: [] };
    enrolledUser.courses.push(theCourse);
  }

  // Find or create the module
  let theModule = theCourse.modules.find(mod => mod.moduleId === parentModule);

  if (!theModule) {
    theModule = { moduleId: parentModule, lessons: [] };
    theCourse.modules.push(theModule);
  }

  let theLesson = theModule.lessons.find(lesson => lesson.lessonId === currentStory);

  if (!theLesson) {
    theLesson = { lessonId: currentStory, blocks: [] };
    theModule.lessons.push(theLesson);
  }

  const block = theLesson.blocks.find((blockId) => blockId === lastBlock.id)
  if (!block) theLesson.blocks.push(lastBlock.id);

  tools.Logger.log(() => `Updating enrolled user progress for ${endUser.enrolledUserId}`);
  tools.Logger.log(() => `Current Story: ${currentStory}`);
  tools.Logger.log(() => `Parent Module: ${parentModule}`);
  tools.Logger.log(() => `Parent Course: ${parentCourse}`);
  tools.Logger.log(() => `Lesson: ${JSON.stringify(theLesson)}`);

  // Save changes
  await enrolledDataServ.updateEnrolledUser(enrolledUser);
};