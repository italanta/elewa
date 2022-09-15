import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
/**
 * Block that expects the user to enter input their email address
 */
export interface EmailMessageBlock extends StoryBlock{
  
  /**Email that is expected as input */
   email?:string;
}