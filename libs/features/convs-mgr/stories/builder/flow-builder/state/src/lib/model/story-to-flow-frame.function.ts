import { Story } from "@app/model/convs-mgr/stories/main";
import { FlowBuilderStateFrame } from "./flow-builder-state-frame.interface";
import { FlowStory, WFlow } from "@app/model/convs-mgr/stories/flows";

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
      version: '3.1',
      data_api_version: '3.0',
      routing_model: {
      },
      screens: [{
        id: story.id as string,
        layout: {
          type: 'SingleColumnLayout',
          children: []
        },
        data: { },
        title: 'Screen I',
        terminal: true
      }]
    },
    validation_errors: []
  };
}