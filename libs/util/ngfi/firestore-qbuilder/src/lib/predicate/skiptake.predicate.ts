import { Query as FirestoreQuery } from '@firebase/firestore-types';
import { Predicate } from "./predicate.interface";

export class SkipTakePredicate extends Predicate
{
  constructor(private _fieldName: string, private _orderDirection: 'asc' | 'desc' = 'desc',private _startAt: any, private _n: number,) {
    super('skip-take');
  }

  build(query: FirestoreQuery): FirestoreQuery {
    return query.orderBy(this._fieldName, this._orderDirection).startAfter(this._startAt).limit(this._n);
  }

}
