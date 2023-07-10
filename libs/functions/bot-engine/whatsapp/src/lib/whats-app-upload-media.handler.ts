import axios from 'axios'
import * as path from 'path';
import * as fs from 'fs/promises';
import {createReadStream} from 'fs';
import { tmpdir } from 'os';
import * as mime from 'mime-types';
import * as FormData from 'form-data';

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
export class WhatsAppUploadMediaHandler extends FunctionHandler<CommunicationChannel, RestResult>
{
  channel: WhatsAppCommunicationChannel;
  _tools: HandlerTools;

  public async execute(payload: CommunicationChannel, context: HttpsContext, tools: HandlerTools) 
  {
    this._tools = tools;
    this.channel = payload as WhatsAppCommunicationChannel;
    // const storyPublishedTime = __DateFromStorage(await this.__getStoryPublishedDate(this.channel.orgId, this.channel.defaultStory));

    this._tools.Logger.log(()=> `[WhatsApp Upload Media Handler] - Uploading media for Story: ${this.channel.defaultStory}`);

    const connDataService = new ConnectionsDataService(this.channel, tools);
    const blockDataService = new BlockDataService(this.channel, connDataService, this._tools);

    // Get all media blocks from the story and nested stories
    const mediaBlocks = (await blockDataService.getAllMediaBlocks(this.channel.orgId, this.channel.defaultStory)) as FileMessageBlock[];

    // Upload media to WhatsApp and update the block with the media ID
    for(const block of mediaBlocks)
    {
      // Get block updated time
      // const blockUpdatedTime = __DateFromStorage(block.updatedOn);

      // Only upload media if the block was updated after the story was published

      // TODO: Uncomment this when the storyPublishedTime is fixed
      // if(storyPublishedTime && blockUpdatedTime > storyPublishedTime) {

      // Only upload media if the block has a file source
      if(block.fileSrc)
      {
        let mediaId: string;

        // Download the file from Firebase Storage
        const filename = await this._downloadFromFirebaseURL(block.fileSrc);

        // Upload the file to WhatsApp
        if(filename) mediaId = await this._uploadMediaToWhatsApp(this.channel, filename);

        // Update the block with the media ID
        if(mediaId) {
          block.whatsappMediaId = mediaId;

          await blockDataService.updateBlock(this.channel.orgId, this.channel.defaultStory, block);

          this._tools.Logger.log(()=> `Block ${block.id} updated with Media ID: ${mediaId}`);
        }
      }
    // }
    }

    return {status: 200} as RestResult;
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

    const URL = `https://graph.facebook.com/v17.0/${channel.id}/media`;

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
        }
      );

      return response.data.id;
    } catch (error) {
      this._tools.Logger.error(() => `Error uploading file: ${JSON.stringify(error)}`)
      return null;
    }

  }

  private async __getStoryPublishedDate(storyId: string, orgId: string) { 
    const storyRepo$ = this._tools.getRepository<Story>(`orgs/${orgId}/stories`);

    const story  = await storyRepo$.getDocumentById(storyId);

    return story.publishedOn;
  }
}