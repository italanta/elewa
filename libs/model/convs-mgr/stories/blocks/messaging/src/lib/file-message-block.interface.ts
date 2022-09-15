import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Block which sends a file.
 */
export interface FileMessageBlock extends StoryBlock
{
  /** Message to accompany file */
  message?: string;

  /** File source of the message block */
  src?: string;
}

/**
 * Block which sends a message in the form of an image.
 */
export interface ImageMessageBlock extends FileMessageBlock {
  /**Links to the image. an image url */

 }

/**
 * Block which sends a message in the form of a voice message.
 */
export interface VoiceMessageBlock extends FileMessageBlock { }

/**
 * Blocks which sends a message in the form of a sticker message
 */
export interface StickerMessageBlock extends FileMessageBlock { }
