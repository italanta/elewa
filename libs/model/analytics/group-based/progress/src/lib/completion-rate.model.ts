export interface CompletionRateProgress {
  allCourseAverage: number;

  // TODO: split into better types.
  progressData: Record<
    string,
    {
      avgCourseProgress: number;
      modules: Record<string, { avgModuleProgress: number }>;
    }
  >;
};
