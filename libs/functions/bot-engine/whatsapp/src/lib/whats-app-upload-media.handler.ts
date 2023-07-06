import axios from 'axios'
import * as path from 'path';
import * as fs from 'fs';
import { tmpdir } from 'os';
import * as mime from 'mime-types';
import * as FormData from 'form-data';

import { HandlerTools } from '@iote/cqrs';
import { FunctionHandler, RestResult, HttpsContext } from '@ngfi/functions';

import { FileMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ConnectionsDataService, BlockDataService } from '@app/functions/bot-engine';
import { CommunicationChannel, WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { __ConvertWhatsAppApiPayload } from './utils/convert-whatsapp-payload.util';
import { __SendWhatsAppWebhookVerificationToken } from './utils/validate-webhook.function';

/**
 * Receives a message, through a channel registered on the WhatsApp Business API,
 *    handles it, and potentially responds to it.
 */
export class WhatsAppUploadMediaHandler extends FunctionHandler<CommunicationChannel, RestResult>
{
  channel: WhatsAppCommunicationChannel;
  _tools: HandlerTools;

  public async execute(payload: CommunicationChannel, context: HttpsContext, tools: HandlerTools) 
  {
    this._tools = tools;
    this.channel = payload as WhatsAppCommunicationChannel;

    this._tools.Logger.log(()=> `[WhatsApp Upload Media Handler] - Uploading media for Story: ${this.channel.defaultStory}`);

    const connDataService = new ConnectionsDataService(this.channel, tools);
    const blockDataService = new BlockDataService(this.channel, connDataService, this._tools);

    const mediaBlocks = (await blockDataService.getAllMediaBlocks(this.channel.orgId, this.channel.defaultStory)) as FileMessageBlock[];

    for(const block of mediaBlocks)
    
    {
      if(block.fileSrc)
      {
        const filename = await this._downloadFromFirebaseURL(block.fileSrc);

        const mediaId = await this._uploadMediaToWhatsApp(this.channel, filename);

        if(mediaId) {
          block.whatsappMediaId = mediaId;

          await blockDataService.updateBlock(this.channel.orgId, this.channel.defaultStory, block);

          this._tools.Logger.log(()=> `Block ${block.id} updated with Media ID: ${mediaId}`);
        }
      }
    }

    return {status: 200} as RestResult;
  }

  /**
   * Method which checks if the whatsapp data object is empty.
   *  This means the webhook has not yet been verified. */
  private _dataResIsEmpty(data) 
  {
    return Object.keys(data).length === 0;
  }

  /**
   * Fetches the media file, saves it to /tmp directory on the cloud function then returns the file path
   * @param URL 
   * @param mime_type - allows us to get the extension of the file
   * @returns filePath and fileName
   */
  private async _downloadFromFirebaseURL(URL: string)
  {
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

      const tempFilePath = path.join(tmpdir(), (filename));
  
      // Save the downloaded file or perform other operations
      // For example, you can use fs.writeFile to save the file to disk:
      fs.writeFile(tempFilePath, response.data, (error) => {
        if (error) {
          this._tools.Logger.error(()=> `Error saving file: ${error}`);
        } else {
          this._tools.Logger.log(()=> `File saved: ${tempFilePath}`);
          return tempFilePath;
        }
      });
      return tempFilePath;
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

      const rawData = fs.createReadStream(filepath)
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
}