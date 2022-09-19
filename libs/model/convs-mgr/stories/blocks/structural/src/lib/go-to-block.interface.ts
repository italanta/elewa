import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * A block which jumps to a certain other block.
 *  (± a go to statement)
 */
export interface GoToBlock extends StoryBlock
{   
  /** Story/Section to navigate too */
  sectionId: string;
  
  /** Block to navigate too */
  blockId: string;
}