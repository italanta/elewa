import { MicroAppStatus } from "@app/model/convs-mgr/micro-app/base";
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";


/**
 * The interface for an assessment specific Micro App. 
 */

export interface AssessmentMicroAppBlock extends StoryBlock {
  name?: string;

  status?: MicroAppStatus

}
