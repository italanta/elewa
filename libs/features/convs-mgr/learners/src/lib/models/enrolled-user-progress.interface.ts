/** user progress per course */
export interface EnrolledUserProgress {
  name?: string;
  enrollmentDate: Date;
  modules: Module[];
}

/** user progress per module */
export interface Module {
  name?: string;
  lessons: Lesson[];
}

/** user progress per lesson */
export interface Lesson {
  name?: string;
  progress: number;
}
