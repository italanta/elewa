/** course completion rate progress */
export interface CompletionRateProgress {
  allCourseAverage: number;
  progressData: CourseCompletionProgress[];
}

/** completion rate progress data at course level */
interface CourseCompletionProgress {
  courseId: string;
  avgCourseProgress: number;
  modules: ModuleCompletionProgress[];
}

/** completion rate progress data at module level */
interface ModuleCompletionProgress {
  moduleId: string;
  avgModuleProgress: number;
}

/** progress data record */
export type ProgressDataRecord = Record<string, { avgCourseProgress: number; modules: Record<string, { avgModuleProgress: number }> }>;

