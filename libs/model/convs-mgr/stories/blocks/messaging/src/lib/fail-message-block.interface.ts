import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface FailMessageBlock extends StoryBlock {
  message?: string;

  defaultTarget?: string;
}
