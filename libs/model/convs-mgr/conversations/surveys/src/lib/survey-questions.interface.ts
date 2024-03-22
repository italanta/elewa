import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

export interface SurveyQuestion extends StoryBlock {
  questionType: SurveyQuestionType;
  marks?: number;
  feedback?: SurveyFeedBack;
  options?: SurveyQuestionOptions[];
  prevQuestionId?: string;
  nextQuestionId?: string;
}

export interface SurveyQuestionOptions {
  id: string;
  text: string;
}

export interface SurveyFeedBack {
  message: string;
  condition: FeedbackCondition;
}

export enum FeedbackCondition {
  Correct = 1,
  Wrong = 2,
  FiftyFifty = 3,
}

export enum SurveyQuestionType {
  SingleSelectOptions = 1,
}

export enum SurveyOptionValue {
  Correct = 1,
  Wrong = 2,
  FiftyFifty = 3,
}
