import axios from "axios";

import { tmpdir } from 'os';
import { createWriteStream } from "fs";
import { join } from 'path';
import { extension } from "mime-types";

import { HandlerTools } from "@iote/cqrs";
import { __DECODE_AES } from "@app/elements/base/security-config";

import { ActiveChannel } from "@app/functions/bot-engine";

import { MetaMessagingProducts, RecepientType, WhatsAppMessageType, WhatsAppOutgoingMessage, WhatsAppTemplateMessage, WhatsappTemplateParameter } from "@app/model/convs-mgr/functions";
import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Message, MessageTemplateConfig } from "@app/model/convs-mgr/conversations/messages";

import { WhatsappOutgoingMessageParser } from "../io/outgoing-message-parser/whatsapp-api-outgoing-message-parser.class";
import { StandardMessageOutgoingMessageParser } from "../io/outgoing-message-parser/standardized-message-to-outgoing-message.parser";


/**
 * After the bot engine processes the incoming message and returns the next block,
 *      the block is parsed through the @see {OutgoingMessageParser}, which returns a
 *          a prepared  message that can be sent over the line to its specific channel API. 
 * 
 * @Description Model used to send the prepared messages through whatsApp api
 * 
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
 * 
 * @extends {ActiveChannel}
 * 
 * STEP 1: Assign the access token and the business phone number id
 * STEP 2: Prepare the outgoing whatsapp message
 * STEP 3: Send the message
 */
export class WhatsappActiveChannel implements ActiveChannel
{
  channel: WhatsAppCommunicationChannel;

  constructor(private _tools: HandlerTools, channel: WhatsAppCommunicationChannel)
  {
    this.channel = channel;
  }

  parseOutMessage(storyBlock: StoryBlock, phone: string)
  {
    const outgoingMessagePayload = new WhatsappOutgoingMessageParser().parse(storyBlock, phone);

    return outgoingMessagePayload;
  }

  parseOutStandardMessage(message: Message, phone: string)
  {
    const outgoingMessagePayload = new StandardMessageOutgoingMessageParser().parse(message, phone);

    return outgoingMessagePayload;
  }

  parseOutMessageTemplate(templateConfig: MessageTemplateConfig, phone: string, message: Message)
  {
    // Create the message template payload which will be sent to whatsapp
    const messageTemplate = new WhatsappOutgoingMessageParser()
                              .parseOutMessageTemplate(templateConfig, phone, message);

    return messageTemplate;
  }

  async send(whatsappMessage: WhatsAppOutgoingMessage)
  {
    // STEP 1: Assign the access token and the business phone number id
    //            required by the whatsapp api to send messages
    const ACCESS_TOKEN = this.channel.accessToken;
    const PHONE_NUMBER_ID = this.channel.id;


    // STEP 2: Prepare the outgoing whatsapp message
    //         Convert it to a JSON string
    const outgoingMessage = JSON.stringify(whatsappMessage);

    this._tools.Logger.log(() => `[SendWhatsAppMessageModel]._sendRequest - Generated message ${JSON.stringify(whatsappMessage)}`);

    // STEP 3: Send the message
    //         Generate the facebook url through which we send the message
    const URL = `https://graph.facebook.com/v14.0/${PHONE_NUMBER_ID}/messages`;

    /**
     * Execute the post request using axios and pass in the URL, ACCESS_TOKEN and the outgoingMessage
     * 
     * @see https://axios-http.com/docs/post_example
     * 
     */
    const res = await axios.post(
      URL,
      outgoingMessage,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    ).then(response =>
    {
      this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: Success in sending message ${JSON.stringify(response.data)}`);
    }).catch(error =>
    {
      if (error.response) {
        // Request made and server responded
        this._tools.Logger.debug(() => `[SendWhatsAppMessageModel].sendMessage: url is: ${URL}`);
        this._tools.Logger.log(() => `Axios post request: Response Data error 💀 ${JSON.stringify(error.response.data)}`);
        this._tools.Logger.log(() => `Axios post request: Response Header error 🤕 ${JSON.stringify(error.response.headers)}`);
        this._tools.Logger.log(() => `Axios post request.sendMessage: Response status error⛽ ${JSON.stringify(error.response.status)}`);

      } else if (error.request) {
        // The request was made but no response was received
        this._tools.Logger.log(() => `Axios post request: Request error 🐱‍🚀${error.request}`);
      } else {
        // Something happened in setting up the request that triggered an Error
        this._tools.Logger.log(() => `Axios post request: Different Error is ${error.message}`);
      }
    });
    return res;

  }


  /**
   * When a user sends an image from whatsapp, we just receive an ID, so we have to call another endpoint
   *    to get the URL, and then call this URL to get the image.
   * 
   * @param mediaId - The unique identifier assigned to the media file by the whatsapp api
   * @returns binary data of the media file
   */
  async getMediaFile(mediaId: string, mime_type: string)
  {
    const URL = await this._getMediaUrl(mediaId);

    if (URL) return this._fetchMedia(URL, mime_type);
  }

  /**
   * Obtains the url for downloading the media.
   * @param mediaId 
   * @returns 
   */
  private async _getMediaUrl(mediaId: string)
  {
    if (mediaId) {
      const URL = `https://graph.facebook.com/v15.0/${mediaId}`;
      try {
        const mediaInformation = await axios.get(URL,
          {
            headers: {
              'Authorization': `Bearer ${this.channel.accessToken}`,
            }
          });
        return mediaInformation.data.url;
      } catch (error) {
        this._tools.Logger.log(() => `Unable to get media information: ${error}`);
      }
    }

  }

  /**
   * Fetches the media file, saves it to /tmp directory on the cloud function then returns the file path
   * @param URL 
   * @param mime_type - allows us to get the extension of the file
   * @returns filePath and fileName
   */
  private async _fetchMedia(URL: string, mime_type: string)
  {
    // Get a unix timestamp for the name
    const fileName = Date.now().toString();

    // Get the extension from the mime_type of the file
    const fileExtension = extension(mime_type) as string;
    const fileNameWithExt = fileName + '.' + fileExtension;

    // Get the temp directory path to save the save
    const tempFilePath = join(tmpdir(), (fileNameWithExt));

    // Create a stream to write the file to the temp directory
    const writer = createWriteStream(tempFilePath);

    try {
      return axios.get(URL,
        {
          headers: {
            'Authorization': `Bearer ${this.channel.accessToken}`,
          },
          responseType: 'stream'
        }).then((response) =>
        {

          return new Promise((resolve, reject) =>
          {
            response.data.pipe(writer);

            let error = null;
            writer.on('error', err =>
            {
              error = err;
              writer.close();

              reject(`Encountered error while fetching file: ${error}`);
            });

            writer.on('close', () =>
            {
              if (!error) {
                resolve({
                  "filePath": tempFilePath,
                  "fileName": fileNameWithExt
                });

                this._tools.Logger.log(() => `Fetched file from whatsapp successful`);
              }
            });
          });

        });
    } catch (error) {
      this._tools.Logger.log(() => `Encountered error while fetching file: ${error}`);
    }
  }
}