import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { IObject } from '@iote/bricks';

export interface AssessmentQuestion extends StoryBlock, IObject {
  questionType: AssessmentQuestionType;
  marks: number;
  message: string;
  feedback?: AssessmentFeedBack;
  options?: AssessmentQuestionOptions[];
  prevQuestionId?: string;
  nextQuestionId?: string;
  textAnswer?: AssessmentTextAnswer;
}

export interface AssessmentQuestionOptions {
  id: string;
  text: string;
  accuracy: AssessmentOptionValue;
  feedback: string;
}

export interface AssessmentTextAnswer {
  text: string,
  accuracy: AssessmentOptionValue,
  feedback?: string;
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
