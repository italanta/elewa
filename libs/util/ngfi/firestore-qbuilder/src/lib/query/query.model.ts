import { Query as FirestoreQuery, CollectionReference } from '@firebase/firestore-types';

import { MaxPredicate } from '../predicate/max.predicate';
import { MinPredicate } from '../predicate/min.predicate';
import { LimitPredicate } from '../predicate/limit.predicate';
import { WherePredicate } from '../predicate/where.predicate';
import { OrderByPredicate } from '../predicate/order-by.predicate';
import { SkipTakePredicate } from '../predicate/skiptake.predicate';

import { Predicate } from '../predicate/predicate.interface';

export class Query {

  private _predicates: Predicate[];

  constructor() { this._predicates = []; }

  /**
   * Add where statement to query
   *
   * @param fieldName  'Targetted fieldname in the database'
   * @param comparitor '==', '>=', >', '<=', '<'
   * @param value      'Value for targetted fieldname
   */
  where(fieldName: string, comparitor: '==' | '>=' | '>' | '<=' | '<' | 'array-contains' | 'array-contains-any' | 'in'| '!=', value: any) {
    this._addPredicate(new WherePredicate(fieldName, comparitor, value));

    return this;
  }

  /**
   * Add orderBy statement to query
   *
   * @param fieldName The field on which to order
   * @param order The order - asc, desc
   */
  orderBy(fieldName: string, order: 'asc' | 'desc') {
    this._addPredicate(new OrderByPredicate(fieldName, order));

    return this;
  }

  /**
   * Add limit statement to query
   *
   * @param n Number to take.
   */
  limit(n: number) {
    this._addPredicate(new LimitPredicate(n));

    return this;
  }

  /** Get (n?) record(s) with last value for fieldName */
  max(fieldName: string, n?: number) {
    this._addPredicate(new MaxPredicate(fieldName, n));

    return this;
  }

  /** Get (n?) record(s) with first value for fieldName */
  min(fieldName: string, n?: number) {
    this._addPredicate(new MinPredicate(fieldName, n));

    return this;
  }

  /** Get (n?) record(s) with first value for fieldName */
  skipTake(fieldName: string, orderDirection: 'asc' | 'desc', startAt: any, n: number) {
    this._addPredicate(new SkipTakePredicate(fieldName,orderDirection, startAt, n));
    return this;
  }

  private _addPredicate(p: Predicate) {
    this._predicates.push(p);
  }

  /**
   * Builds query for FireStore.
   */
  public __buildForFireStore(collRef: CollectionReference) : FirestoreQuery
  {
    let query = <FirestoreQuery> collRef;

    for (const pred of this._predicates) {
      query = pred.build(query);
    }

    return query;
  }

}
