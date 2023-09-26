import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { Button } from "./question-message-block.interface";

export interface SurveyQuestionBlock extends StoryBlock {
  message: string;
  marks: number;
  options?: ButtonsBlockButton<Button>[];
  feedback?: string;
}