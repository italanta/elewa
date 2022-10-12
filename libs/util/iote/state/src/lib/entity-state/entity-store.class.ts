import * as _ from 'lodash';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SubSink } from 'subsink';

import { StoreEventTypes } from '../state/store.class';
import { EntityState } from './entity-state.interface';
import { Stateful } from '../state/stateful.interface';

export abstract class EntityStore<T> implements Stateful<T[]>
{
  protected _sbS = new SubSink();

  protected bs: BehaviorSubject<EntityState<T>>;
  protected state$: Observable<EntityState<T>>;

  state: EntityState<T>;
  previous: EntityState<T>[] = [];

  protected abstract store: string;

  constructor(initialValues: Partial<T[]>, loading = false)
  {
    this.state = new EntityState(initialValues as T[], loading);

    this.bs = new BehaviorSubject<EntityState<T>>(this.state);
    this.state$ = this.bs.asObservable();

    this._sbS.sink = this.state$.subscribe(s => { this.state = s; });
  }

  /** @warning: Should not always be called directly.
   *            Entity stores will have their own methods that can manage subscriptions
   *              depending on queries. */
  get(filter? : (t: T) => boolean) : Observable<T[]>
  {
    return this.state$.pipe(map(state => filter ? state.entities.filter(filter)
                                                : state.entities));
  }

  protected patch(newValues: T[], event?: StoreEventTypes)
  {
    this.previous.unshift(_.cloneDeep(this.state));

    const newState = new EntityState( _.concat(this.state.entities, newValues));

    console.groupCollapsed(`[${this.store} store] [patch] [event: ${event}]`);
    console.log("Change", newValues)
    console.log("from", this.previous.length > 0 ? this.previous[0] : 'void');
    console.log("to",   newState);
    console.groupEnd();

    this.bs.next(newState);
  }

  set(newValues: Partial<T[]> | any, event: StoreEventTypes = "Not Specified")
  {
    const newValue = new EntityState(newValues);

    this.previous.unshift(_.cloneDeep(this.state));
    const newState = Object.assign({}, newValue) as EntityState<T>;

    console.groupCollapsed(`[${this.store} store] [set] [event: ${event}]`);
    console.log("Change", newValue)
    console.log("From", this.previous.length > 0 ? this.previous[0] : 'void');
    console.log("To",   newState);
    console.groupEnd();


    this.bs.next(newState);
  }
}
