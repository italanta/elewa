import { IObject } from "@iote/bricks";

import { MoveOnCriteriaTypes } from "@app/model/convs-mgr/conversations/assessments";

import { Attempt } from "./assessment-attempt.interface";

export interface AssessmentProgress extends IObject {
  // Id of the assessment
  id: string;
  
  // The number of attempt starting from 1. Should be incremented everytime the user attempts the assessment
  attemptCount: number;
  
  // The final score of the assessment based on the attempts
  finalScore: number;
  
  // A map that represents the question response and score of each attempt. See example below: on how this is set
  attempts: AttemptsMap;
  
  /** Total score of the assessment */
  maxScore: number;

  /** The mininum score for an assessment to be marked as 'passed' */
  moveOnCriteria?: {
    criteria: MoveOnCriteriaTypes;
    /** The minimum score in percentage that the learner must have in 
     *    order to continue with the flow
     */
    passMark?: number;
}
orgId: string;
endUserId: string;
title: string;
}

export type AttemptsMap = {[key: number]: Attempt};