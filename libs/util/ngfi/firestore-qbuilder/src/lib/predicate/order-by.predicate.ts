import { Query as FirestoreQuery } from '@firebase/firestore-types';
import { Predicate } from "./predicate.interface";

export class OrderByPredicate extends Predicate {

  constructor(private _fieldName: string, private _order: 'asc' | 'desc') {
    super('orderBy');
  }

  build(query: FirestoreQuery): FirestoreQuery
  {
    return this._order == 'asc' ? query.orderBy(this._fieldName)
                                : query.orderBy(this._fieldName, this._order);
  }

}
