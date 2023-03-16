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
  private mediaFileURL: string = "";

  constructor(private _tools: HandlerTools) { }

  /**
   * 
   * Takes the media message, uploads the file, saves the information to the database and returns the firebase storage url
   * 
   */
  async saveFileInformation(message: Message, endUserId: string, activeChannel: ActiveChannel)
  {
    const orgId = activeChannel.channel.orgId;

    const mediaFileMessage = message as FileMessage;

    const mediaFileInfo: FileUpload = {
      id: mediaFileMessage.mediaId,
      filePath: this.mediaFileURL,
      mime_type: mediaFileMessage.mime_type
    };

    const fileRepo$ = this._tools.getRepository<FileUpload>(`orgs/${orgId}/end-users/${endUserId}/files`);

    await fileRepo$.create(mediaFileInfo, mediaFileInfo.id);

    return this.mediaFileURL;
  }

  async getFileURL(message: FileMessage, endUserId: string, activeChannel: ActiveChannel)
  {
    if(!this.mediaFileURL) {
      const file = await activeChannel.getMediaFile(message.mediaId, message.mime_type);

      if (file) this.mediaFileURL = await this._uploadFile(endUserId, message.type, file.filePath, file.fileName) as string;

    }

    return this.mediaFileURL;
  }

  /** Uploads the file to firebase storage */
  private async _uploadFile(endUserId: string, fileType: MessageTypes, filePath: string, fileName: string)
  {
    const storageFileName = `${endUserId}_${fileName}`;

    const platformPrefix = endUserId.split('_')[0];

    const platformType = __PrefixToPlatformType(platformPrefix);

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

      result[0].makePublic()
      return result[0].publicUrl()
    }
    catch (e) {

      this._tools.Logger.error(() => `[Upload Service] Upload file failed: ${e}`);

    }

  }

}