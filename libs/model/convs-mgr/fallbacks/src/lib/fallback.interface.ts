import { IObject } from '@iote/bricks';

import { FallBackActionTypes } from './fallback-action-types.enum';

export interface Fallback extends IObject {
  /** A set of user phrases and texts the user might say 
   *    that we link to actions.
   */
  userInput: Set<string>;

  /** The types of actions to take */
  actionsType: FallBackActionTypes;

  /** The action to take on */
  actionDetails: Action;

  /** Whether the fallback is active or not */
  active: boolean;
}

export interface Action {
  description: string;
}
