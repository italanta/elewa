import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * This block expects a phone number as input from the user
 */
export interface PhoneMessageBlock extends StoryBlock {

  /**The phone number expected as input */
  phoneNumber?: string;

}