import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";
import { OutgoingMessagePayload } from "@app/model/convs-mgr/conversations/messages";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface ActiveChannel 
{
  /** Descriptor of the channel this service controls */
  channel: CommunicationChannel;

  /**
   * @param {OutgoingMessage} msg - Message to put on the channel 
   * TODO: Define OutgoingMessage
   */
  send(msg: OutgoingMessagePayload);

  parseOutMessage(storyBlock: StoryBlock, phone: string);
}