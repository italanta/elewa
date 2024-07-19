import { MicroAppProgress } from '@app/model/convs-mgr/micro-app/base';

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
}