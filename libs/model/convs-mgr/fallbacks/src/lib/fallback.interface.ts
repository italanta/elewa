import { IObject } from '@iote/bricks';

import { FallBackActionTypes } from './fallback-action-types.enum';

export interface Fallback extends IObject {
  /** A set of user phrases and texts the user might say 
   *    that we link to actions.
   */
  userInput: string[]; // TrainingPhrases

  /** The types of actions to take */
  actionsType: FallBackActionTypes;

  /** The action to take on fallback */
  actionDetails: Action; // describes 

  /** Whether the fallback is active or not */
  active: boolean;

  orgId: string;
  botId: string;
}

export interface Action {
  description: string;
}
