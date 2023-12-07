/** course completion rate progress */
export interface CompletionRateProgress {
  allCourseAverage: number;
  progressData: CourseProgress[];
}

/** progress data at course level */
export interface CourseProgress {
  courseId: string;
  avgCourseProgress: number;
  modules: ModuleProgress[];
}

/** progress data at module level */
export interface ModuleProgress {
  moduleId: string;
  avgModuleProgress: number;
}

/** progress data record */
export type ProgressDataRecord = Record<string, { avgCourseProgress: number; modules: Record<string, { avgModuleProgress: number }> }>;

