import { BlockLibraryFilterStrategy, StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Default filter strategy that returns all blocks.
 */
export class DefaultBlockFilterStrategy implements BlockLibraryFilterStrategy {

    /**
     * Returns all blocks without filtering.
     * @param {StoryBlock[]} groupedBlocks - The blocks to be returned.
     * @returns {StoryBlock[]} - Unfiltered blocks.
     */
    filterBlocks(groupedBlocks: StoryBlock[]): StoryBlock[] {
      return [...groupedBlocks];
    }
  }