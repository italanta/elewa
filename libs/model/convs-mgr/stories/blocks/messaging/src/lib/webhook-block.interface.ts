import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { HttpMethodTypes } from '@app/model/convs-mgr/stories/blocks/main';
/**
 * Block that makes and receives responses from the HTTP
 */
export interface WebhookBlock extends StoryBlock {
  defaultTarget?: string;
  /** The http url of the endpoint */
  httpUrl?: string;

  /** An array of variables defined in the previous input blocks e.g. variable for a name input block can be `name`*/
  variablesToPost?: string[];

  variablesToSave?: VariablesToSave[];

  /** Http Method to be choosen by the user */
  httpMethod?: HttpMethodTypes;

  /** Optional token if required by the api we are posting to */
  authorizationToken?: string;

}

export interface VariablesToSave {
  name: string;
  value: string;
}