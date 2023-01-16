import { Story } from "@app/model/convs-mgr/stories/main";
import { StoryBlock, StoryBlockConnection, VariablesConfig } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * Represents the full state of the story editor.
 * 
 *  - In essence a mini-redux pattern tied to the story editor frame. Holds mother and child states.
 */
export interface StoryEditorState 
{
  story: Story;
  blocks: StoryBlock[];
  connections: StoryBlockConnection[];
  variables: VariablesConfig[];
}