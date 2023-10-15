import axios, { AxiosError } from "axios";

import { tmpdir } from 'os';
import { createWriteStream } from "fs";
import { join } from 'path';
import { extension } from "mime-types";

import { __DateFromStorage } from "@iote/time";
import { HandlerTools } from "@iote/cqrs";
import { __DECODE_AES } from "@app/elements/base/security-config";
import { ActiveChannel, EndUserDataService, MailMergeVariables, MessagesDataService, generateEndUserId } from "@app/functions/bot-engine";

import { WhatsAppOutgoingMessage } from "@app/model/convs-mgr/functions";
import { PlatformType, WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { Message, MessageTemplateConfig, TemplateMessageParams } from "@app/model/convs-mgr/conversations/messages";

import { WhatsappOutgoingMessageParser } from "../io/outgoing-message-parser/whatsapp-api-outgoing-message-parser.class";
import { StandardMessageOutgoingMessageParser } from "../io/outgoing-message-parser/standardized-message-to-outgoing-message.parser";
import { EndUser } from "@app/model/convs-mgr/conversations/chats";

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
  endUserService: EndUserDataService;

  constructor(private _tools: HandlerTools, channel: WhatsAppCommunicationChannel)
  {
    this.channel = channel;
    this.endUserService = new EndUserDataService(_tools, channel.orgId);
  }

  parseOutMessage(storyBlock: StoryBlock, endUser: EndUser)
  {
    const outgoingMessagePayload = new WhatsappOutgoingMessageParser().parse(storyBlock, endUser.phoneNumber);

    return outgoingMessagePayload;
  }

  async parseOutStandardMessage(message: Message, phone: string)
  {
    const n = this.channel.n;
    const endUserId = generateEndUserId(phone, PlatformType.WhatsApp, n);
    const endUser = await this.endUserService.getEndUser(endUserId)

    if(message.params) {
      const variables = {
        ...endUser,
        ...endUser.variables
      }

      const newParams = message.params.map((param)=> {
        if(param.value == '_var_'){
          param.value = variables[param.name] || 'undefined';
        }
        return param;
      })
  
      message.params = newParams;
    }

    const outgoingMessagePayload = new StandardMessageOutgoingMessageParser().parse(message, phone);

    return outgoingMessagePayload;
  }

  parseOutMessageTemplate(templateConfig: MessageTemplateConfig, params: TemplateMessageParams[], phone: string, message: Message)
  {
    // Create the message template payload which will be sent to whatsapp
    const messageTemplate = new WhatsappOutgoingMessageParser()
                              .getMessageTemplateParserOut(templateConfig, params, phone, message);

    return messageTemplate;
  }

  private async _handle24hourWindow(phone: string, message: Message)
  {
    const msgService = new MessagesDataService(this._tools);
    const n = this.channel.n;
    const orgId = this.channel.orgId;
    const endUserId = generateEndUserId(phone, PlatformType.WhatsApp, n);
    const endUser = await this.endUserService.getEndUser(endUserId)

    const latestMessage = await msgService.getLatestUserMessage(endUserId, orgId);

    let latestMessageTime;
    let limitPassed

    if (latestMessage) {
      // Get the date in milliseconds
      latestMessageTime = __DateFromStorage(latestMessage.createdOn as Date);
    }
      if (latestMessageTime) { 

        limitPassed = ((Date.now() - latestMessageTime.unix() * 1000) > 864000)

      }

      if (limitPassed || !latestMessage) {
        this._tools.Logger.log(() => `[SendOutgoingMsgHandler].execute - Whatsapp 24 hours limit has passed`);
        this._tools.Logger.log(() => `[SendOutgoingMsgHandler].execute - Sending opt-in message to ${phone}`);

        const templateConfig = this.channel.templateConfig;

        if (templateConfig) {
          let params = message.params || templateConfig.params || null;

          if(params) params = await this.__resolveParamVariables(params, orgId, endUser.variables);

          // Get the message template
          return this.parseOutMessageTemplate(templateConfig, params, phone, message);
        } else {
          this._tools.Logger.warn(() => `[SendOutgoingMsgHandler].execute [Warning] - Missing Template Config! Message may fail to reach user`);
          return null;
        }
      }

  }

  private async __resolveParamVariables(params: TemplateMessageParams[], orgId: string, variables: any) { 
    const resolvedParams = params.map(async (param) => {

      if(param.value === '_var_') {
        const value = variables[param.name];

        return { 
          name: param.name,
          value
        } as TemplateMessageParams
      } else {
        return param
      }
    });

    return Promise.all(resolvedParams);
  }

  async send(whatsappMessage: WhatsAppOutgoingMessage, standardMessage?: Message) {
    try {
      if (standardMessage) {
        whatsappMessage = (await this._handle24hourWindow(whatsappMessage.to, standardMessage)) || whatsappMessage;
      }
  
      // STEP 1: Assign the access token and the business phone number id
      // required by the WhatsApp API to send messages
      const ACCESS_TOKEN = this.channel.accessToken;
      const PHONE_NUMBER_ID = this.channel.id;
  
      // STEP 2: Prepare the outgoing WhatsApp message
      // Convert it to a JSON string
      const outgoingMessage = JSON.stringify(whatsappMessage);
  
      this._tools.Logger.log(() => `[SendWhatsAppMessageModel]._sendRequest - Generated message ${JSON.stringify(whatsappMessage)}`);
  
      // STEP 3: Send the message
      // Generate the Facebook URL through which we send the message
      const URL = `https://graph.facebook.com/v14.0/${PHONE_NUMBER_ID}/messages`;
  
      /**
       * Execute the post request using axios and pass in the URL, ACCESS_TOKEN, and the outgoingMessage
       *
       * @see https://axios-http.com/docs/post_example
       *
       */
      const response = await axios.post(
        URL,
        outgoingMessage,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: Success in sending message ${JSON.stringify(response.data)}`);
  
      // Mark the conversation as complete
      await this.endUserService.setConversationComplete(`w_${this.channel.n}_${whatsappMessage.to}`, 1);
  
      this._tools.Logger.log(() => `[SendWhatsAppMessageModel].sendMessage: Conversation marked as complete`);
      
      return {success: true, data: response.data};
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          // Request made and server responded
          this._tools.Logger.debug(() => `[SendWhatsAppMessageModel].sendMessage: url is: ${URL}`);
          this._tools.Logger.log(() => `Axios post request: Response Data error 💀 ${JSON.stringify(axiosError.response.data)}`);
          this._tools.Logger.log(() => `Axios post request: Response Header error 🤕 ${JSON.stringify(axiosError.response.headers)}`);
          this._tools.Logger.log(() => `Axios post request.sendMessage: Response status error⛽ ${JSON.stringify(axiosError.response.status)}`);

          return {success: false, data: axiosError.response.data};
        } else if (axiosError.request) {
          // The request was made but no response was received
          this._tools.Logger.log(() => `Axios post request: Request error 🐱‍🚀${axiosError.request}`);
          return {success: false, data: axiosError.request};
        } else {
          // Something happened in setting up the request that triggered an Error
          this._tools.Logger.log(() => `Axios post request: Different Error is ${axiosError.message}`);
          return {success: false, data: axiosError.message};
        }
      } else {
        // Handle non-Axios errors here
        this._tools.Logger.log(() => `Error: ${error.message}`);
      }
    }
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