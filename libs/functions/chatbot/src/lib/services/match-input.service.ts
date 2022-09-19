import { findIndex as __findIndex } from 'lodash';

export class MatchInputService{
    constructor(){}

    exactMatch(message: string, options: any[]): number{
        const optionIndex  =  __findIndex(options, (o) => o.message == message);
 
        return optionIndex
    }
}