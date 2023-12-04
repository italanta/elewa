import { ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress';

export function _getProgressCompletionRateData(
  allUsersProgress: ParticipantProgressMilestone[]
) {

  const progressData: Record<
    string,
    {
      avgCourseProgress: number;
      modules: Record<string, { avgModuleProgress: number }>;
    }
  > = {};

  allUsersProgress.map((participantProgress) => {
    const { participant } = participantProgress;

    participant.progress.map((enrolledUserProgress) => {
      const { courseId } = enrolledUserProgress;

      enrolledUserProgress.modules.map((moduleProgress) => {
        const { moduleId } = moduleProgress;

        if (!progressData[courseId]) {
          progressData[courseId] = { avgCourseProgress: 0, modules: {} };
        }

        if (!progressData[courseId].modules[moduleId]) {
          progressData[courseId].modules[moduleId] = { avgModuleProgress: 0 };
        }

        progressData[courseId].modules[moduleId].avgModuleProgress +=
          moduleProgress.moduleProgress;
      });
    });
  });

  // Calculate average progress for each module within each course
  for (const courseId in progressData) {
    const modules = progressData[courseId].modules;

    let totalCourseProgress = 0;
    let totalModules = 0;

    for (const moduleId in modules) {
      const moduleProgress = modules[moduleId];
      moduleProgress.avgModuleProgress /= allUsersProgress.length;
      totalCourseProgress += moduleProgress.avgModuleProgress;
      totalModules++;
    }

    // Calculate average course progress based on module progress only
    progressData[courseId].avgCourseProgress = totalModules > 0 ? totalCourseProgress / totalModules : 0;
  }

  return progressData;
}
