import { Query as FirestoreQuery } from '@firebase/firestore-types';
import { Predicate } from "./predicate.interface";

export class LimitPredicate extends Predicate {

  constructor(private _n: number) {
    super('limit');
  }

  build(query: FirestoreQuery): FirestoreQuery {
    return query.limit(this._n);
  }

}
