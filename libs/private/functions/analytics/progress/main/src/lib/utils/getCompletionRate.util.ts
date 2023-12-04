import { ParticipantProgressMilestone } from '@app/model/analytics/group-based/progress';

export function _getProgressCompletionRateData(
  allUsersProgress: ParticipantProgressMilestone[]
) {

  const progressData: Record<
    string,
    {
      avgCourseProgress: number;
      classrooms: Record<string, { progress: number, modules: Record<string, { progress: number }> }>;
    }
  > = {};

  allUsersProgress.forEach((participantProgress) => {
    const { participant, classroom } = participantProgress;

    participant.progress.forEach((enrolledUserProgress) => {
      const { courseId } = enrolledUserProgress;

      enrolledUserProgress.modules.forEach((moduleProgress) => {
        const { moduleId } = moduleProgress;

        if (!progressData[courseId]) {
          progressData[courseId] = { avgCourseProgress: 0, classrooms: {} };
        }

        if (!progressData[courseId].classrooms[classroom.id]) {
          progressData[courseId].classrooms[classroom.id] = { progress: 0, modules: {} };
        }

        if (!progressData[courseId].classrooms[classroom.id].modules[moduleId]) {
          progressData[courseId].classrooms[classroom.id].modules[moduleId] = { progress: 0 };
        }

        progressData[courseId].classrooms[classroom.id].modules[moduleId].progress += moduleProgress.moduleProgress;
      });
    });
  });

  // Calculate average progress for each module within each course and classroom
  for (const courseId in progressData) {
    const classrooms = progressData[courseId].classrooms;

    for (const classroomId in classrooms) {
      const modules = classrooms[classroomId].modules;

      let totalClassroomProgress = 0;
      let totalModules = 0;

      for (const moduleId in modules) {
        const moduleProgress = modules[moduleId];
        moduleProgress.progress /= allUsersProgress.length;
        totalClassroomProgress += moduleProgress.progress;
        totalModules++;
      }

      // Calculate average classroom progress
      progressData[courseId].classrooms[classroomId].progress = totalModules > 0 ? totalClassroomProgress / totalModules : 0;
    }

    // Calculate average course progress
    progressData[courseId].avgCourseProgress = Object.values(classrooms).reduce((total, classroom) => total + classroom.progress, 0) / Object.keys(classrooms).length;
  }

  console.log(JSON.stringify(progressData));

  return progressData;
}
