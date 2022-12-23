import { FileMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes, WhatsAppMessageType } from "@app/model/convs-mgr/functions";

import { WhatsappOutgoingMessageParser } from "./whatsapp-api-outgoing-message-parser.class";

/**
 * This contains only the unit tests for the whatsapp outgoing message parser
 * 
 * To add a test for a new method, add it after the 'parseOutStickerMessage' describe
 * 
 * For reference, look at the whatsapp WhatsappIncomingMessageParser test.
 */
describe("WhatsappOutgoingMessageParser", () =>
{
  let outgoingMessageParser: WhatsappOutgoingMessageParser;

  beforeEach(() =>
  {
    outgoingMessageParser = new WhatsappOutgoingMessageParser();

  });
  // describe("parseOutStickerMessage", () =>
  // {
  // });

});