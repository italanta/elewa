import { FlowStory, WFlow } from "@app/model/convs-mgr/stories/flows";

/**
 * A state frame of the flow builder.
 */
export interface FlowBuilderStateFrame
{
  /** The story */
  story: FlowStory;
  /** The flow configuration */
  flow: WFlow;
}
