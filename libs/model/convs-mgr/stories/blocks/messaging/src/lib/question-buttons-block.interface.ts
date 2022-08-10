import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';


export interface QuestionButtonsBlock<T> extends StoryBlock
{
  /** Message to accompany file */
  message?: string;

  //the default target that should determine the diretion incase user has wrong/invalid input
  defaultPath?: string;

  // array of buttons
  buttons?: ButtonsBlockButton<T>[];
}