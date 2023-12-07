import { 
  CompletionRateProgress, 
  ParticipantProgressMilestone, 
  ProgressDataRecord
} from '@app/model/analytics/group-based/progress';

export function _getProgressCompletionRateData(allUsersProgress: ParticipantProgressMilestone[]) : CompletionRateProgress {
  const coursesProgressData: ProgressDataRecord = allUsersProgress.reduce((result, participantProgress) => {
    if (!participantProgress) return result;

    const { participant } = participantProgress;

    participant.progress.map((enrolledUserProgress) => {
      const { courseId } = enrolledUserProgress;

      enrolledUserProgress.modules.map((moduleProgress) => {
        const { moduleId } = moduleProgress;

        if (!result[courseId]) {
          result[courseId] = { avgCourseProgress: 0, modules: {} };
        }

        if (!result[courseId].modules[moduleId]) {
          result[courseId].modules[moduleId] = { avgModuleProgress: 0 };
        }

        result[courseId].modules[moduleId].avgModuleProgress += moduleProgress.moduleProgress;
      });
    });

    return result;
  }, {});

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
    progressData: convertObjectsToArray(coursesProgressData),
  }
}

/** parse the data into an array format */
function convertObjectsToArray(data: ProgressDataRecord) {
  return Object.keys(data).map((id) => {
    const item = data[id];

    return {
      courseId: id,
      avgCourseProgress: item.avgCourseProgress,
      modules: Object.keys(item.modules).map((moduleId) => {

        return {
          moduleId: moduleId,
          avgModuleProgress: item.modules[moduleId].avgModuleProgress
        };
      })
    };
  });
}
