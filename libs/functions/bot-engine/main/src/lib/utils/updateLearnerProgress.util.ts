import { HandlerTools } from "@iote/cqrs";

import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { EnrolledUserBotModule, EnrolledUserCourse } from "@app/model/convs-mgr/learners";
import { BotModule } from "@app/model/convs-mgr/bot-modules";
import { Bot } from "@app/model/convs-mgr/bots";

import { EnrolledUserDataService } from "../services/data-services/enrolled-user.service";
import { BotModuleDataService } from "../services/data-services/botmodules.service";
import { StoriesDataService } from "../services/data-services/stories.service";
import { CoursesDataService } from "../services/data-services/courses.service";

/** update the enrolled user's progress with the just completed story(lesson's) details*/
export async function updateLearnerProgress (currentStory: string, lastBlock:StoryBlock, endUser:EndUser, tools:HandlerTools, orgId:string) {
  if(!currentStory) return;

  const enrolledDataServ = new EnrolledUserDataService(tools, orgId);
  const botModDataService = new BotModuleDataService(tools, orgId);
  const storiesDataService = new StoriesDataService(tools, orgId);
  const courseDataService = new CoursesDataService(tools, orgId);

  let enrolledCourse: EnrolledUserCourse;
  let parentCourse: Bot;
  let parentModule: BotModule;

  const contactID = endUser.id.split('_')[2];

  const enrolledUser = await enrolledDataServ.getEnrolledUserByPhoneNumber(endUser.phoneNumber ?? contactID);
  
  // Skip learner progress if user does not exist
  if (!enrolledUser) return;

  const lesson = (await storiesDataService.getStory(currentStory));

  if (lesson.parentModule) {
    parentModule = (await botModDataService.getBotModule(lesson.parentModule));
  }

  if (parentModule) {
    parentCourse = (await courseDataService.getBot(parentModule.parentBot));
  }


  if (enrolledUser.courses == null) enrolledUser.courses = [];

  // Find or create the course
  if(parentCourse) {
    enrolledCourse = enrolledUser.courses.find(course => course.courseId === parentCourse.id);
    // If the user has completed the course
    if(parentCourse.courseCompleteEventId && parentCourse.courseCompleteEventId === lastBlock.id) {
      if(enrolledUser.completedCourses) {
        enrolledUser.completedCourses.unshift({id: parentCourse.id, completionDate: new Date()});
      } else {
        enrolledUser.completedCourses = [{id: parentCourse.id, completionDate: new Date()}];
      }
    }
  }

  if (!enrolledCourse) {
    enrolledCourse = {
      courseId: parentCourse ? parentCourse.id : 'unknown', 
      courseName: parentCourse ? parentCourse.name : 'unknown',
      enrollmentDate: new Date(),
      lastEngagementTime: endUser.lastActiveTime,
      modules: [],
    };

    enrolledUser.courses.push(enrolledCourse);
  } else {
    enrolledCourse.courseName = parentCourse.name;
    enrolledCourse.lastEngagementTime = endUser.lastActiveTime;
  };

  // Find or create the module
  let  enrolledModule: EnrolledUserBotModule;
  if(parentModule) {
    enrolledModule = enrolledCourse.modules.find(mod => mod.moduleId === parentModule.id);
  }

  if (!enrolledModule) {
    enrolledModule = { moduleId: parentModule.id, moduleName: parentModule.name, lessons: [] };
    enrolledCourse.modules.push(enrolledModule);
  } else enrolledModule.moduleName = parentModule.name;


  let enrolledLesson = enrolledModule.lessons.find(lesson => lesson.lessonId === currentStory);

  if (!enrolledLesson) {
    enrolledLesson = { lessonId: currentStory, lessonName: lesson.name,  blocks: [] };
    enrolledModule.lessons.push(enrolledLesson);
  } else enrolledLesson.lessonName = lesson.name;

  const block = enrolledLesson.blocks.find((blockId) => blockId === lastBlock.id)
  if (!block) enrolledLesson.blocks.push(lastBlock.id);

  tools.Logger.log(() => `Updating enrolled user progress for ${endUser.enrolledUserId}`);
  tools.Logger.log(() => `Current Story: ${currentStory}`);
  tools.Logger.log(() => `Parent Module: ${parentModule.id}`);
  tools.Logger.log(() => `Parent Course: ${parentCourse.id}`);
  tools.Logger.log(() => `Lesson: ${JSON.stringify(enrolledLesson)}`);

  // Save changes
  await enrolledDataServ.updateEnrolledUser(enrolledUser);
};