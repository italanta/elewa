import { MicroAppProgress } from '@app/model/convs-mgr/micro-app/base';
import { MoveOnCriteriaTypes } from '@app/model/convs-mgr/conversations/assessments';

import { QuestionResponse } from './assessment-question-response.interface';

export interface AssessmentProgressUpdate extends MicroAppProgress {
  questionResponses: QuestionResponse[];
  timeSpent: number;
  assessmentDetails: AssessmentDetails;
  hasSubmitted?: boolean;
}

export interface AssessmentDetails {
  questionCount: number;
  maxScore: number;
  moveOnCriteria?: {
    criteria: MoveOnCriteriaTypes;
    /** The minimum score in percentage that the learner must have in 
     *    order to continue with the flow
     */
    passMark?: number;
  },

  title: string;
  
  /** The story the micro-app is linked in */
  storyId?: string;

  /** The module the micro-app is linked in */
  moduleId?: string;

  /** The bot the micro-app is linked in */
  botId?: string;
}