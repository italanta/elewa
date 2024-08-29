import { Story, StoryModuleTypes } from "@app/model/convs-mgr/stories/main";
import { FlowStatus } from "./flow-status.enum";

/**
 * A story that is of type flow
 */
export interface FlowStory extends Story
{
  type: StoryModuleTypes.Flow;

  config: FlowStoryConfig;
}

/** 
 * Configuration of the flow-story 
 */
export interface FlowStoryConfig 
{
   /** Flow name */
   name: string;

   /** Status of the flow */
   status: FlowStatus;

  /**
   * The URL of the WA Flow Endpoint. Starting from Flow JSON version 3.0 this property should be specified only via API. Do not provide this field if you are cloning a Flow with Flow JSON version below 3.0.
   */
  endpoint_uri: string;

  /**
   * 
   */
  whatsAppFlowId?: string;
}