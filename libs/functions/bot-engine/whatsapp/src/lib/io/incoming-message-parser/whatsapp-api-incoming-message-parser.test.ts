import { FileMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes, WhatsAppMessageType } from "@app/model/convs-mgr/functions";

import { WhatsappIncomingMessageParser } from "./whatsapp-api-incoming-message-parser.class";

/**
 * This contains only the unit tests for the whatsapp incoming message parser
 * 
 * To add a test for a new method, add it after the 'parseInStickerMessage' describe
 */
describe("WhatsappIncomingMessageParser", () =>
{
  let incomingMessageParser: WhatsappIncomingMessageParser;

  beforeEach(() =>
  {
    incomingMessageParser = new WhatsappIncomingMessageParser();

  });

  describe("parseInStickerMessage", () =>
  {
    // Create a sample incoming whatsapp sticker message payload
    const exampleStickerMessage = {
      from: "SENDER_PHONE_NUMBER",
      id: "wamid.ID",
      timestamp: "TIMESTAMP",
      type: WhatsAppMessageType.STICKER,
      sticker: {
        mime_type: "image/webp",
        sha256: "HASH",
        id: "ID"
      }
    };

    it("should interpret incoming sticker messages", () =>
    {  
      const stickerMessage = incomingMessageParser.parse(MessageTypes.STICKER, exampleStickerMessage);

      // Check if the parser is returning null
      expect(stickerMessage).toBeTruthy();

      // Check if the resulting object contains the media ID
      expect(stickerMessage).toHaveProperty("mediaId");

      // Check if the resulting object contains the media ID
      expect(stickerMessage).toHaveProperty("mime_type");

      // Check the type of the message to be a sticker
      expect(stickerMessage.type).toEqual(MessageTypes.STICKER);
    });
  });

});