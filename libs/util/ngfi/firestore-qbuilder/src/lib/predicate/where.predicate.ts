import { Query as FirebaseQuery } from '@firebase/firestore-types';
import { Predicate } from "./predicate.interface";

export type WhereComparitor = '<' | '>' | '<=' | '==' | '>=' | 'array-contains' | 'in' | 'array-contains-any' | '!=';

export class WherePredicate extends Predicate {

  constructor(private _fieldName: string, private _comparitor: WhereComparitor, private _value: any) {
    super('where');
  }

  build(query: FirebaseQuery): FirebaseQuery {
    return query.where(this._fieldName, <any> this._comparitor, this._value);
  }

}
