import { Story } from "@app/model/convs-mgr/stories/main";
import { FlowBuilderStateFrame } from "./flow-builder-state-frame.interface";
import { FlowScreenV31, FlowStory, WFlow } from "@app/model/convs-mgr/stories/flows";

/**
 * Function to load in a new story
 * 
 * @param story - The flow story
 * @param frame - The flow configuration (set if not yet exists)
 * @returns {FlowBuilderStateFrame}
 */
export function __StoryToFlowFrame(story: Story, flow?: WFlow): FlowBuilderStateFrame
{
  return {
    story: story as FlowStory,
    flow: flow ?? _initFrame(story)
  };
}

/** Initialise the default story configuration */
function _initFrame(story: Story): WFlow
{
  return {
    flow: {
      id: '',
      version: '3.1',
      data_api_version: '3.0',
      routing_model: {
      },
      screens: [_CreateScreen(story.id as string, 1)]
    },
    validation_errors: [],
    timestamp: new Date().getTime()
  };
}

/**
 * @param storyId - The id of the story the flow screen is being created
 * @param n - The number of the screen added. e.g. 
 *              Screen 1. If it is the first screen pass 1.
 * @returns FlowScreenV31
 */
export function _CreateScreen(storyId: string, n: number): FlowScreenV31 {
  return {
    id: `${storyId}_${n}`,
    layout: {
      type: 'SingleColumnLayout',
      children: []
    },
    data: { },
    title: `SCREEN ${n}`,
    terminal: true
  };
}
