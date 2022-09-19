import { findIndex as __findIndex } from 'lodash';

/**
 * [Work In Progress]
 * Contains methods to match options and user input
 */
export class MatchInputService{
    constructor(){}

    exactMatch(message: string, options: any[]): number{
        const optionIndex  =  __findIndex(options, (o) => o.message == message);
 
        return optionIndex
    }
}