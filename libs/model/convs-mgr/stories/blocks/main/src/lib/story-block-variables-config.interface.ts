import { IObject } from "@iote/bricks";
import { HttpMethods } from "./http-methods.interface";

import { Position } from "./position.interface";
import { StoryBlock } from "./story-block.interface";

export interface VariablesConfig extends IObject {

  /** Block Type */
  variable: StoryBlock

  /** Position of the block on the editor */
  position: Position;

  name?: string;

  /** The http method. Should be selected from a dropdown */
  htttpMethod?: HttpMethods;

  /** The http url of the endpoint */
  httpUrl?: string;

  /** An array of variables defined in the previous input blocks e.g. variable for a name input block can be `name`*/
  // variablesToPost?: string[];

  /** Optional token if required by the api we are posting to. Should be encoded with `__ENCODE_AES`*/
  authorizationToken?: string;

}