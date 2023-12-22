/** user progress per course */
export interface EnrolledUserProgress {
  id: string;
  name?: string;
  enrollmentDate: Date;
  modules: Module[];
}

/** user progress per module */
export interface Module {
  id: string;
  name?: string;
  lessons: Lesson[];
}

/** user progress per lesson */
export interface Lesson {
  name?: string;
  progress: number;
}
