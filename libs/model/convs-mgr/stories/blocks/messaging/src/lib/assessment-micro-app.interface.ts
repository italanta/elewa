import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { MicroAppStatus } from "./micro-app-block.interface";


/**
 * The interface for an assessment specific Micro App. 
 */

export interface AssessmentMicroAppBlock extends StoryBlock {
  name?: string;

  status?: MicroAppStatus

}
