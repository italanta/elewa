import { StoryBlock } from "./story-block.interface";

/**
 * Interface for block filtering strategy.
 */
export interface BlockLibraryFilterStrategy {
    /**
     * Filters the provided blocks based on the specific strategy.
     * @param {StoryBlock[]} groupedBlocks - The blocks to be filtered.
     * @returns {StoryBlock[]} - The filtered blocks.
     */
    filterBlocks(groupedBlocks: StoryBlock[]): StoryBlock[];
}