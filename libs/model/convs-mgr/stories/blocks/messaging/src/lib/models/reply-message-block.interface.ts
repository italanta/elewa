import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block that expects input from the user by replying to a message
 */
export interface ReplyMessageBlock extends StoryBlock{

  replyMessage?:String;
}