import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

import { MicroAppBlock } from "./micro-app-block.interface";
import { Button } from "./question-message-block.interface";

/**
 * The interface for an assessment specific Micro App. 
 */

export interface AssessmentMicroAppBlock extends MicroAppBlock {
  defaultTarget?: string;
  options?: ButtonsBlockButton<Button>[];
}
