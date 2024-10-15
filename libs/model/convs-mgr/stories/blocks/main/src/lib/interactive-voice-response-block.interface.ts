import { StoryBlock } from "./story-block.interface";

/**
 * IVR-specific block which extends a regular StoryBlock with audio support.
 * These blocks are used for IVR modules where audio interactions are required.
 */
export interface IVRStoryBlock extends StoryBlock {
    /** URL for the audio file */
    audioUrl?: string;
}