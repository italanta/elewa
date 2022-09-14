import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a message to ask the name.
 */
export interface NameMessageBlock extends StoryBlock{

  /**Stores the entered name entered by the userr */
  name?:string;
}
