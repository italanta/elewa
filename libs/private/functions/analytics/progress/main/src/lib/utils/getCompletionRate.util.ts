import { ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress';

export function _getProgressCompletionRateData(
  allUsersProgress: ParticipantProgressMilestone[]
) {

  const coursesProgressData: Record<
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

        if (!coursesProgressData[courseId]) {
          coursesProgressData[courseId] = { avgCourseProgress: 0, modules: {} };
        }

        if (!coursesProgressData[courseId].modules[moduleId]) {
          coursesProgressData[courseId].modules[moduleId] = { avgModuleProgress: 0 };
        }

        coursesProgressData[courseId].modules[moduleId].avgModuleProgress +=
          moduleProgress.moduleProgress;
      });
    });
  });

  // Calculate average progress for each module within each course
  for (const courseId in coursesProgressData) {
    const modules = coursesProgressData[courseId].modules;

    let totalCourseProgress = 0;
    let totalModules = 0;

    for (const moduleId in modules) {
      const moduleProgress = modules[moduleId];
      moduleProgress.avgModuleProgress /= allUsersProgress.length;
      totalCourseProgress += moduleProgress.avgModuleProgress;
      totalModules++;
    }

    // Calculate average course progress based on module progress only
    coursesProgressData[courseId].avgCourseProgress = totalModules > 0 ? totalCourseProgress / totalModules : 0;
  }

  // Calculate the overall average progress across all courses
  const totalCourses = Object.keys(coursesProgressData).length;
  const overallCourseProgress = totalCourses > 0
    ? Object.values(coursesProgressData).reduce((total, course) => total + course.avgCourseProgress, 0) / totalCourses
    : 0;

  return {
    allCourseAverage: overallCourseProgress,
    progressData: coursesProgressData
  }
}
