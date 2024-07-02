import { FlowPageLayoutElementTypesV31, FlowPageLayoutElementV31 } from "./flow-element.interface";

/**
 * Flow image.
 * 
 * Supports JPEG and PNG uploads up to 300kb
 * Max number per screen - 3. 
 */
export interface FlowImage extends FlowPageLayoutElementV31
{
  /** Image description (for Talkback and Voice Over support) */
  "alt-text": string;

  /** Image source */
  src: string;

  /** Image width */
  width?: number;

  /** Image height */
  height: number;
  
  /** Image scale type */
  "scale-type": 'contain' | 'cover';

  /** Aspect ratio - Default 1 */
  "aspect-ration": number;

  type: FlowPageLayoutElementTypesV31.IMAGE
}

