import { BlockLibraryFilterStrategy, StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Filter strategy for IVR blocks.
 */
export class IvrBlockFilterStrategy implements BlockLibraryFilterStrategy {
  
    /**
     * Filters blocks to return only valid IVR blocks.
     * @param {StoryBlock[]} groupedBlocks - The blocks to be filtered.
     * @returns {StoryBlock[]} - Filtered IVR-specific blocks.
     */
    filterBlocks(groupedBlocks: StoryBlock[]): StoryBlock[] {
      return groupedBlocks.filter(block => this.isIVRBlock(block));
    }
  
    /**
     * Checks if a block is a valid IVR block.
     * @param {Block} StoryBlock - The block to be checked.
     * @returns {boolean} - True if the block is a valid IVR block.
     */
    private isIVRBlock(block: any): boolean {
      const validIVRBlockTypes = new Set([
        StoryBlockTypes.TextMessage,
        StoryBlockTypes.QuestionBlock,
        StoryBlockTypes.List,
        StoryBlockTypes.JumpBlock,
        StoryBlockTypes.EndStoryAnchorBlock
      ]);
  
      return validIVRBlockTypes.has(block.type);
    }
  }
  