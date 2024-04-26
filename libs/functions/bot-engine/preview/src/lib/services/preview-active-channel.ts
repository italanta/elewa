import { __DateFromStorage } from "@iote/time";
import { HandlerTools } from "@iote/cqrs";

import { __DECODE_AES } from "@app/elements/base/security-config";
import { ActiveChannel, EndUserDataService } from "@app/functions/bot-engine";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Message } from "@app/model/convs-mgr/conversations/messages";

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
  channel: any;
  endUserService: EndUserDataService;

  constructor(private _tools: HandlerTools, channel: any)
  {
    this.channel = channel;
    this.endUserService = new EndUserDataService(_tools, channel.orgId);
  }
  
  parseOutMessage(storyBlock: StoryBlock, endUser: EndUser)
  {
    return {} as any;
  }
  
  send(msg: any, standardMessage?: Message)
  {
    throw new Error("Method not implemented.");
  }
}