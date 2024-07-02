import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow image.
 * Sizes to screen width
 */
export interface FlowImage extends FlowPageLayoutElementV31
{
  /** Image source */
  src: string;

  /** Image height */
  height: number;
  
  /** Image scale type */
  "scale-type":"contain"

  type: FlowPageLayoutElementTypesV31.IMAGE
}

