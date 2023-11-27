export interface EnrolledUserProgress {
  name: string | undefined;
  modules: {
    name: string | undefined;
    lessons: {
      name: string | undefined;
      progress: number;
    }[];
  }[];
}
