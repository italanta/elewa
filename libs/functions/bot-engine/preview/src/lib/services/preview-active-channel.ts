import { HandlerTools } from "@iote/cqrs";

import { ActiveChannel, BlockToStandardMessage, EndUserDataService, MessagesDataService } from "@app/functions/bot-engine";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Message, MessageDirection } from "@app/model/convs-mgr/conversations/messages";
import { CommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

/**
 * After the bot engine processes the incoming message and returns the next block,
 *      the block is parsed through the @see {OutgoingMessageParser}, which returns a
 *          a prepared  message that can be sent over the line to its specific channel API. 
 * 
 * @Description Model used to send the prepared messages through whatsApp api
 * 
 * @see https://developers.facebook.com/docs/messenger-platform/send-messages
 * 
 * @extends {ActiveChannel}
 * 
 * STEP 1: Assign the access token and the business phone number id
 * STEP 2: Prepare the outgoing whatsapp message
 * STEP 3: Send the message
 */
export class PreviewActiveChannel implements ActiveChannel
{
  channel: CommunicationChannel;
  endUserService: EndUserDataService;

  constructor(private _tools: HandlerTools, channel: CommunicationChannel)
  {
    this.channel = channel;
    this.endUserService = new EndUserDataService(_tools, channel.orgId);
  }
  
  parseOutMessage(storyBlock: StoryBlock, endUser: EndUser)
  {
    const blockToStandardMessage = new BlockToStandardMessage();
    return blockToStandardMessage.convert(storyBlock);
  }
  
  async send(msg: Message)
  {
    // Save in DB
    const messageService = new MessagesDataService(this._tools, true);

    msg.direction = MessageDirection.FROM_CHATBOT_TO_END_USER;

    const orgId = this.channel.orgId;
    const endUserId = this.channel.id;

    await messageService.saveMessage(msg, orgId, endUserId);
  }
}