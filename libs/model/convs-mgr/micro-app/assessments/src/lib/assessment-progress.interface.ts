import { IObject } from "@iote/bricks";

import { Attempt } from "./assessment-attempt.interface";

export interface AssessmentProgress extends IObject {
  // Id of the assessment
  id: string;
  
  // The number of attempt starting from 1. Should be incremented everytime the user attempts the assessment
  attemptCount: number;
  
  // The final score of the assessment based on the attempts
  finalScore: number;
  
  // A map that represents the question response and score of each attempt. See example below: on how this is set
  attempts: Map<number, Attempt>;
  
  /** Total score of the assessment */
  maxScore: number;
}