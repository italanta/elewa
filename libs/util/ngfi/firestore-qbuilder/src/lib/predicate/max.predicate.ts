import { Query as FirestoreQuery } from '@firebase/firestore-types';
import { Predicate } from "./predicate.interface";

export class MaxPredicate extends Predicate
{
  constructor(private _fieldName: string, private _n?: number) {
    super('max');
  }

  build(query: FirestoreQuery): FirestoreQuery {
    return query.orderBy(this._fieldName, 'desc').limit(this._n ? this._n : 1);
  }

}
