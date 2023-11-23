/** progress covered by the enrolled user */
export interface EnrolledUserCourse {
  courseId: string;
  modules: EnrolledUserBotModule[];
}

// Define a Module interface
export interface EnrolledUserBotModule {
  moduleId: string;
  lessons: string[];
}
