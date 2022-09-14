import { findIndex as __findIndex } from 'lodash';

export class MatchOptions {
  type: MatchingOptions;

  constructor(type: MatchingOptions) {
    this.type = type;
  }

  match(){
    switch (this.type) {
        case 1:
            return this.exactMatch
            break;
        default:
            return this.exactMatch
            break;
    }
  }

  private exactMatch(message: string, options: any[]): number {
    const optionIndex  =  __findIndex(options, (o) => o.message == message);

    return optionIndex
  }
}

export enum MatchingOptions {
  ExactMatch = 1,
}
