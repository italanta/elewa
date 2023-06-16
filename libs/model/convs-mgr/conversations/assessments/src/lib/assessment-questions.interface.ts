import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

export interface AssessmentQuestion extends StoryBlock {
  questionType: AssessmentQuestionType;
  marks: number;
  feedback?: AssessmentFeedBack;
  options?: AssessmentQuestionOptions[];
  prevQuestionId?: string;
  nextQuestionId?: string;
}

export interface AssessmentQuestionOptions {
  id: string;
  text: string;
  accuracy: AssessmentOptionValue;
}

export interface AssessmentFeedBack {
  message: string;
  condition: FeedbackCondition;
}

export enum FeedbackCondition {
  Correct = 1,
  Wrong = 2,
  FiftyFifty = 3,
}

export enum AssessmentQuestionType {
  SingleSelectOptions = 1,
}

export enum AssessmentOptionValue {
  Correct = 1,
  Wrong = 2,
  FiftyFifty = 3,
}
