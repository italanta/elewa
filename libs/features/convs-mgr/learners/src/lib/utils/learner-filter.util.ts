import { EnrolledEndUser, EnrolledEndUserStatus } from "@app/model/convs-mgr/learners";

/** filter learners by class */
export function filterLearnersByClass(learners: EnrolledEndUser[], selectedClassId: string, ) {
  const filteredLearners = learners.filter(learner => learner.classId === selectedClassId);
  return filteredLearners;
}

/** filter learners by status */
export function filterLearnersByStatus(learners: EnrolledEndUser[], selectedStatus: string) {
  const filteredLearners = learners.filter(learner => EnrolledEndUserStatus[learner.status] === selectedStatus);
  return filteredLearners;
}

/** filter learners by course*/
export function filterLearnersByCourse(learners: EnrolledEndUser[], selectedCourse: string) {
  const filteredLearners = learners.filter((learner) => {   
    if (!learner.courses || !learner.courses.length) return

    return learner.courses[learner.courses?.length - 1].courseId === selectedCourse
  })

  return filteredLearners;
}

/** filter learners by platform */
export function filterLearnersByPlatform(learners: EnrolledEndUser[], selectedPlatform: string) {
  const filteredLearners = learners.filter((learner) => {
    return learner.platformDetails && learner.platformDetails[selectedPlatform.toLowerCase()]
  });

  return filteredLearners
}
