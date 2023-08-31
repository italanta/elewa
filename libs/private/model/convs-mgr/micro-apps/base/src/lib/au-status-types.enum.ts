/** The status of the learner's AU progress through the course */
export enum AUStatusTypes { 
  /** This verb indicates that the AU was launched by the LMS */
  Launched = "launched", // ---- Set by LMS

  /** An "initialized" statement is used by the AU to indicate that it has 
   *    been fully initialized. The "initialized" statement MUST follow, within a 
   *      reasonable period of time, the "launched" statement created by the LMS. */
  Initialized = "initialized", // ---- Set by AU

  /** The verb indicates the learner viewed or did all of the relevant 
   *  activities in an AU presentation. */
  Completed = "completed", // ---- Set by AU

  /** The learner attempted and succeeded in a judged activity in the AU. */
  Passed = "passed", // ---- Set by AU

  /** The learner attempted and failed in a judged activity in the AU. */
  Failed = "failed", // ---- Set by AU

  /** The verb "Abandoned" indicates that the AU session was abnormally 
   *    terminated by a learner's action (or due to a system failure). */
  Abandoned = "abandoned", // ---- Set by LMS

  /** The verb "Waived" indicates that the LMS has determined that the AU 
   *    requirements were met by means other than the moveOn criteria being met. */
  Waived = "waived", // ---- Set by LMS

  /** The verb "Terminated" indicates that the AU was terminated by the Learner 
   *    and that the AU will not be sending any more statements for the launch session. */
  Terminated = "terminated", // ---- Set by AU

  /** The verb "Satisfied" indicates that the LMS has determined that the Learner 
   *      has met the moveOn criteria of all AU's in a block or has met the moveOn 
   *        criteria for all AU's in the course. */
  Satisfied = "satisfied", // ---- Set by LMS
}