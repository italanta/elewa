import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface MultiContentInputBlock extends StoryBlock{

  /** Actual question */
  message?: string;
}