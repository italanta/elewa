export interface EnrolledUserProgress {
  name?: string;
  enrollmentDate: Date;
  modules: {
    name?: string;
    lessons: {
      name?: string;
      progress: number;
    }[];
  }[];
}
