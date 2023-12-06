export interface CompletionRateProgress {
  allCourseAverage: number;

  // TODO: split into better types.
  progressData: {
    courseId: string;
    avgCourseProgress: number;
    modules: {
      moduleId: string;
      avgModuleProgress: number;
    }[];
  }[]
};
