import * as admin from 'firebase-admin';

import * as uuid from "uuid";

import { HandlerTools } from '@iote/cqrs';

import { __PrefixToPlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { MessageTypes } from '@app/model/convs-mgr/functions';
import { FileMessage, Message } from '@app/model/convs-mgr/conversations/messages';

import { FileUpload } from '@app/state/file';

import { ActiveChannel } from '../../model/active-channel.service';

/**
 * Uploads the media file and returns the firebase storage url
 */
export class BotMediaProcessService 
{
  constructor(private _tools: HandlerTools){}

  /**
   * 
   * Takes the media message, uploads the file, saves the information to the database and returns the firebase storage url
   * 
   */
  async processMediaFile(message: Message, endUserId: string, activeChannel: ActiveChannel)
  {
    const mediaFileMessage = message as FileMessage;

    const mediaFileURL = await this._getFileURL(message, endUserId, activeChannel)

    const mediaFileInfo: FileUpload = {
      id: mediaFileMessage.mediaId,
      filePath: mediaFileURL as string || null,
      mime_type: mediaFileMessage.mime_type
    }

    await this._saveFileInformation(endUserId, activeChannel.channel.orgId, mediaFileInfo)

    return mediaFileURL
  }

  private async _getFileURL(message: Message, endUserId: string, activeChannel: ActiveChannel)
  {
    const fileMessage = message as FileMessage;
    const file = await activeChannel.getMediaFile(fileMessage.mediaId, fileMessage.mime_type);

    if (file) return this._uploadFile(endUserId, fileMessage.type, file.filePath, file.fileName);
  }

  private async _saveFileInformation(endUserId: string, orgId: string, file: FileUpload)
  {
    const fileRepo$ = this._tools.getRepository<FileUpload>(`orgs/${orgId}/end-users/${endUserId}/files`);
    
    return fileRepo$.create(file, file.id)
  }

  /** Uploads the file to firebase storage */
  private async _uploadFile(endUserId: string, fileType: MessageTypes, filePath: string, fileName: string)
  {
    const storageFileName = `${endUserId}_${fileName}`;

    const platformPrefix = endUserId.split('_')[0];

    const platformType =  __PrefixToPlatformType(platformPrefix);

    const path = `${platformType}/messaging/${fileType}s/${endUserId}/${storageFileName}`;

    const bucket = admin.storage().bucket();
    const destination = `${path}`;

    try {
      // Uploads a local file to the bucket
      const result = await bucket.upload(filePath, {
        destination: destination,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        }

      });

      this._tools.Logger.log(() => `${storageFileName} uploaded to /${path}/${storageFileName}.`);

      return result[0].getSignedUrl({
        action: 'read',
        expires: '03-09-2491'
      }).then((url) =>
      {
        return url[0] as string;
      }).catch((error) => this._tools.Logger.error(() => `[Upload Service] Encoutered error when getting URL: ${error}`));
    }
    catch (e) {

      this._tools.Logger.error(() => `[Upload Service] Upload file failed: ${e}`);

    }

  }

}