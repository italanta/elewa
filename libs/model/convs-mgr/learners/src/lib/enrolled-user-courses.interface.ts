/** progress covered by the enrolled user */
export interface EnrolledUserCourse {
  courseId: string;
  courseName: string;
  modules: EnrolledUserBotModule[];
};

// Define a Module interface
export interface EnrolledUserBotModule {
  moduleId: string;
  moduleName: string;
  lessons: EnrolledUserLesson[];
};

export interface EnrolledUserLesson {
  lessonId: string;
  lessonName: string;
  blocks: string[];
};
