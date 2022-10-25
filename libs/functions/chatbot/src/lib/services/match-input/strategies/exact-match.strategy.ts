import { findIndex as __findIndex } from 'lodash';

import { MatchStrategy } from '../match-strategy.interface';

export class ExactMatch implements MatchStrategy {

  match(message: string, options: any[]) {
    const optionIndex: number = __findIndex(options, (o) => o.message.toLowerCase() == message.toLowerCase());

    return optionIndex;
  }

  matchId(id: string, options: any[]) {
    const optionIndex: number = __findIndex(options, (o) => o.id == id);

    return optionIndex;
  }
}
