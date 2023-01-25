import { analyticInstance$ } from '@angular/fire/analytics';
import { FileMessage } from '@app/model/convs-mgr/conversations/messages';
import {
  MessageTypes,
  WhatsAppMessageType,
} from '@app/model/convs-mgr/functions';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { WhatsappOutgoingMessageParser } from './whatsapp-api-outgoing-message-parser.class';

/**
 * This contains only the unit tests for the whatsapp outgoing message parser
 *
 * To add a test for a new method, add it after the 'parseOutStickerMessage' describe
 *
 * For reference, look at the whatsapp WhatsappIncomingMessageParser test.
 */
describe('WhatsappOutgoingMessageParser', () => {
  let outgoingMessageParser: WhatsappOutgoingMessageParser;

  beforeEach(() => {
    outgoingMessageParser = new WhatsappOutgoingMessageParser();
  });

  describe('parseOutLocationMessage', () => {
    const exampleLocationMessage = {
      to: 'PHONE_NUMBER',
      type: WhatsAppMessageType.LOCATION,
      location: {
        longitude: "LONG_NUMBER",
        latitude: "LAT_NUMBER",
        name: "LOCATION_NAME",
        address: "LOCATION_ADDRESS",
      },
    };
    it('should interpret outgoing location messages', () => {
      const locationMessage = outgoingMessageParser.parse(
        MessageTypes.LOCATION,
        exampleLocationMessage
      );

      // Check if the parser is returning null
      expect(locationMessage).toBeTruthy();

      // Check if the resulting object contains longitude
      expect(locationMessage).toHaveProperty('longitude');

      // Check if the resulting object contains latitude
      expect(locationMessage).toHaveProperty('latitude');

      // Check if the resulting object contains latitude
      expect(locationMessage).toHaveProperty('name');

      // Check if the resulting object contains latitude
      expect(locationMessage).toHaveProperty('address');

      // Check if the resulting object contains the sender phone number
      expect(locationMessage).toHaveProperty('phone');

      // Check the type of object to be a location
      expect(locationMessage.type).toEqual(MessageTypes.LOCATION);
    });
  });
});
