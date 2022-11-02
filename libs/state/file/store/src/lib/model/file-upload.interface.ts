import { IObject } from '@iote/bricks';
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

/**
 * The interface that supports the upload of files in firestore.
 * Will allow storage of files and the interpretation of files to the chatbot
 */
export interface FileUpload extends IObject 
{
  /**Stores the type of file being uploaded. Types such as: images, audio, video etc */
  fileType?: StoryBlockTypes;

  /**Stores the path with https in firebase storage  */
  filePath?: string;
  
  /**Store the size of the file */
  size?: string;
}