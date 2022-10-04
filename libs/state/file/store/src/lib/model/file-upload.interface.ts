import { IObject } from '@iote/bricks';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * The interface that supports the upload of files in firestore.
 * Will allow storage of files and the interpretation of files to the chatbot
 */
export interface FileUpload extends IObject 
{
  fileId?:string;
  fileType?: StoryBlockTypes;
  filePath?: string;
  size?: string;
}