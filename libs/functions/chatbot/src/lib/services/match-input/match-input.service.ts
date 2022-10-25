import { findIndex as __findIndex } from 'lodash';
import { MatchStrategy } from './match-strategy.interface';

/**
 * [Work In Progress]
 * Contains methods to match options and user input
 */
export class MatchInputService {

    private matchStrategy: MatchStrategy;

    setMatchStrategy(matchStrategy: MatchStrategy){
        this.matchStrategy = matchStrategy
    }

    match(message: string, options: any[]){
        return this.matchStrategy.match(message, options)
    }

    matchId(id: string, options: any[]){
        return this.matchStrategy.matchId(id, options)
    }


}