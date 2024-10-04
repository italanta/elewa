import axios from 'axios'
import * as path from 'path';
import * as fs from 'fs/promises';
import {createReadStream} from 'fs';
import { tmpdir } from 'os';
import * as mime from 'mime-types';
import * as FormData from 'form-data';
import * as moment from 'moment';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';
import { __DateFromStorage } from '@iote/time';

import { FileMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ConnectionsDataService, BlockDataService } from '@app/functions/bot-engine';
import { CommunicationChannel, WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Story } from '@app/model/convs-mgr/stories/main';

import { __ConvertWhatsAppApiPayload } from './utils/convert-whatsapp-payload.util';
import { __SendWhatsAppWebhookVerificationToken } from './utils/validate-webhook.function';

/**
 * Uploads media to WhatsApp and updates the block with the media ID.
 * 
 * This improves the performance of the bot as it does not need to upload 
 *      the media to WhatsApp every time a media block is sent.
 */
export class WhatsAppUploadMediaHandler extends FunctionHandler<CommunicationChannel, any>
{
  channel: WhatsAppCommunicationChannel;
  _tools: HandlerTools;
  API_VERSION: string = process.env.WHATSAPP_VERSION || 'v18.0';

  public async execute(payload: CommunicationChannel, context: HttpsContext, tools: HandlerTools) 
  {
    try {
      this._tools = tools;
      this.channel = payload as WhatsAppCommunicationChannel;
      const botPublishedTime = __DateFromStorage(await this.__getStoryPublishedDate(this.channel.linkedBot, this.channel.orgId));
  
      this._tools.Logger.log(()=> `[WhatsApp Upload Media Handler] - Uploading media for Story: ${this.channel.defaultStory}`);
  
      const connDataService = new ConnectionsDataService(this.channel, tools);
      const blockDataService = new BlockDataService(this.channel, connDataService, this._tools);
  
      // Get all media blocks from the story and nested stories
      const mediaBlocksData = (await blockDataService.getAllMediaBlocks(this.channel.orgId, this.channel.defaultStory));
  
      // Upload media to WhatsApp and update the block with the media ID
      for(const blockData of mediaBlocksData)
      {
        const fileBlock = blockData.data as FileMessageBlock;
        // Get block updated time
        const blockUpdatedTime = __DateFromStorage(fileBlock.updatedOn || fileBlock.createdOn);
  
        // Only upload media if the block was updated after the story was published
        if(!botPublishedTime) return {status: 400} as RestResult;
  
        // TODO: Uncomment this when the storyPublishedTime is fixed
        if(blockUpdatedTime > botPublishedTime || this.__hasExpired(blockUpdatedTime)) {
  
        // Only upload media if the block has a file source
        if(fileBlock.fileSrc)
        {
          let mediaId: string;
  
          // Download the file from Firebase Storage
          const filename = await this._downloadFromFirebaseURL(fileBlock.fileSrc);
  
          // Upload the file to WhatsApp
          if(filename) mediaId = await this._uploadMediaToWhatsApp(this.channel, filename);
  
          // Update the block with the media ID
          if(mediaId) {
            fileBlock.whatsappMediaId = mediaId;
  
            await blockDataService.updateBlock(this.channel.orgId, blockData.storyId, fileBlock);
  
            this._tools.Logger.log(()=> `Block ${fileBlock.id} updated with Media ID: ${mediaId}`);
          }
        }
      }
      }
  
      return {success: true, status: 200, message: "Media uploaded successful"};
    } catch (error) {
      return {success: false, status: 500, message: error};
    }
  }

  /**
   * Fetches the media file, saves it to /tmp directory on the cloud function then returns the file path
   * @param URL 
   * @param mime_type - allows us to get the extension of the file
   * @returns filePath and fileName
   */
  private async _downloadFromFirebaseURL(URL: string)
  {
    let tempFilePath: string;

    let extension: string;
    try {
      const response = await axios.get(URL, {
        responseType: 'arraybuffer',
      });
  
      const basename = path.basename(URL);
      
      const extname = path.extname(basename);

      if(extname.includes('?')) {
        extension = extname.split('?')[0];
      } else {
        extension = extname.split('_')[0];
      }

      const filename = `${Date.now()}${extension}`

      tempFilePath = path.join(tmpdir(), (filename));
  
      // Save the downloaded file or perform other operations
      // For example, you can use fs.writeFile to save the file to disk:

      try {
        await fs.writeFile(tempFilePath, response.data)
        this._tools.Logger.log(()=> `File saved: ${tempFilePath}`);

        return tempFilePath;
      } catch (error) {
        this._tools.Logger.error(()=> `Error saving file: ${error}`);
      }
    } catch (error) {
      this._tools.Logger.error(()=> `Error downloading file: ${error}`);
    }
  }

  private async _uploadMediaToWhatsApp(channel: WhatsAppCommunicationChannel, filepath: string) {
    
    this._tools.Logger.log(()=> `Uploading file to Whatsapp Servers: ${filepath}`);

    const URL = `https://graph.facebook.com/${this.API_VERSION}/${channel.id}/media`;

    const type = mime.lookup(filepath) as string;

    const messagingProduct = 'whatsapp';

    try {

      const formData = new FormData();

      const rawData = createReadStream(filepath)

      formData.append('file', rawData);
      formData.append('type', type);
      formData.append('messaging_product', messagingProduct);
  
      const response = await axios.post(
        URL,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${channel.accessToken}`,
            "Content-Type": "multipart/form-data"
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

      return response.data.id;
    } catch (error) {
      this._tools.Logger.error(() => `Error uploading file: ${JSON.stringify(error)}`)
      return null;
    }

  }

  private async __getStoryPublishedDate(botId: string, orgId: string) { 
    const botsRepo$ = this._tools.getRepository<Story>(`orgs/${orgId}/bots`);

    const bot  = await botsRepo$.getDocumentById(botId);

    return bot?.publishedOn;
  }

  private __hasExpired(blockUpdatedTime: moment.Moment) 
  {
    // Check if the media has not been updated in the last 29 days
    return moment().diff(blockUpdatedTime, 'days') > 29;
  }
}