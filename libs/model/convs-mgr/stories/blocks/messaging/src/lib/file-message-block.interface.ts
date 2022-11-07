import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a file.
 */
export interface FileMessageBlock extends StoryBlock
{
  /** Message to accompany file */
  message?: string;

  /** File source of the message block */
  fileSrc?: string;
}

/**
 * Block which sends a message in the form of an image.
 */
export interface ImageMessageBlock extends FileMessageBlock {}

/**
 * Block which sends a message in the form of a voice message.
 */
export interface VoiceMessageBlock extends FileMessageBlock { }

/**
 * Block that sends a message in the form of a video
 */
export interface VideoMessageBlock extends FileMessageBlock{

  /**This is store the file name that has been retrieved when uploading the file */
  fileName?: string;
}

/** 
 * Blocks which sends a message in the form of a sticker message
 */
export interface StickerMessageBlock extends FileMessageBlock { }

/*
 * Block that sends a message in the form of a document to the user 
 */
export interface DocumentMessageBlock extends FileMessageBlock{}
