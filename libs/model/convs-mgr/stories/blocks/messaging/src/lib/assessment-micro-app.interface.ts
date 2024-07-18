import { MicroAppBlock } from "./micro-app-block.interface";


/**
 * The interface for an assessment specific Micro App. 
 */

export interface AssessmentMicroAppBlock extends MicroAppBlock {
  defaultTarget?: string;
}
