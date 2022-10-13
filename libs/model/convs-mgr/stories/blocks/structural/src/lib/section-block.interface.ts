import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * A block which navigates to a Story Section.
 */
export interface SectionBlock extends StoryBlock
{   
  /** Section to navigate too */
  sectionId: string;
}