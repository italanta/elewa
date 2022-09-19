import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

 /**
   * Block that sends a message to the user and expects a list of items to be returned
   */
export interface ListMessageBlock extends StoryBlock{
  /**
   * The message entered by the user for what they are expected to follow
   */
  message?:string;

  /**
   * An array of list items that the user has passed
  */
  listItems?:ButtonsBlockButton<List>[];

}

interface List {

  /**The id for each list item */
  id: string;
  /** Message to display as answer */
  message: string;

  value?:string;
}