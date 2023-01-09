import { FileMessage } from "@app/model/convs-mgr/conversations/messages";
import { MessageTypes } from "@app/model/convs-mgr/functions";
import { WhatsAppMessageType } from "@app/model/convs-mgr/functions";
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

  describe("parseOutAudioMessage", () =>
  {
    // Create a sample incoming whatsapp audio message payload
    const exampleAudioMessage = {
      from: "SENDER_PHONE_NUMBER",
      id: "wamid.ID",
      timestamp: "TIMESTAMP",
      type: WhatsAppMessageType.AUDIO,
      sticker: {
        mime_type: "audio/webp",
        sha256: "HASH",
        id: "ID"
      }
    };

    it("should interpret outgoing audio messages", () =>
    {  
      const audioMessage = outgoingMessageParser.parse(MessageTypes.AUDIO, exampleAudioMessage);

      // Check if the parser is returning null
      expect(audioMessage).toBeTruthy();

      // Check if the resulting object contains the media ID
      expect(audioMessage).toHaveProperty("mediaId");

      // Check if the resulting object contains the media ID
      expect(audioMessage).toHaveProperty("mime_type");

      // Check the type of the message to be an audio
      expect(audioMessage.type).toEqual(MessageTypes.AUDIO);
    });
  });

});
