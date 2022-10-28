import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export interface ActiveChannel 
{
  /** Descriptor of the channel this service controls */
  channel: CommunicationChannel;

  /**
   * @param {OutgoingMessage} msg - Message to put on the channel 
   * TODO: Define OutgoingMessage
   */
  send(msg: any, channel: CommunicationChannel);
}