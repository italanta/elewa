import { StoryBlock } from "@italanta-apps/model/convs-mgr/stories/blocks/main";

/**
 * A block which asks a question and displays multiple buttons with potential answers.
 *  - Each answer has a different value of type T (string, number, ...). */
export interface ButtonsBlock<T> extends StoryBlock
{
  /** The message which asks the question */
  message: string;

  /** 
   * A list of buttons with question answers.
   * @note - Each button acts as a JSPlumb anchor and can thus connect a previous and next. */
  buttons: ButtonsBlockButton<T>[];
}

/**
 * A button on a ButtonsBlock which represent a potential answer. */
export interface ButtonsBlockButton<T>
{
  /** Answer ID */
  id: string;
  /** Message to display as answer */
  message: string;
  /** Value the answer holds. */
  value?: T;
}
