import { OnDestroy, Inject } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';

import { Stateful } from './stateful.interface';
import { StoreEventTypes } from './store.class';

/** Store for class Objects. Does not serialize past states so Objects can be mutable if local copy is saved! */
export abstract class ObjectStore<T> implements Stateful<T>
{
  protected _sbS = new SubSink();

  protected bs: BehaviorSubject<T>;
  protected state$: Observable<T>;

  state: T;
  previous: T[] = [];

  protected abstract store: string;

  constructor(@Inject('NOOP_INHERIT') initialValue: Partial<T>)
  {
    this.bs = new BehaviorSubject<T>(initialValue as T);
    this.state$ = this.bs.asObservable();

    this.state = initialValue as T;
    this._sbS.sink = this.state$.subscribe(s => { this.state = s; });
  }

  get(): Observable<T> {
    // Create new stream with every set in case subscriber terminates stream
    return this.bs.asObservable();
  }

  protected patch(newValue: T | any, event: StoreEventTypes = "Not Specified")
  {
    this.previous.unshift(this.state);
    const newState = Object.assign({}, this.state, newValue);

    console.groupCollapsed(`[${this.store} store] [patch] [event: ${event}]`);
    console.log("Change", newValue)
    console.log("from", this.previous.length > 0 ? this.previous[0] : 'void');
    console.log("to",   newValue);
    console.groupEnd();

    this.bs.next(newState);
  }

  set(newValue: T, event: StoreEventTypes = "Not Specified")
  {
    this.previous.unshift(this.state);

    console.groupCollapsed(`[${this.store} store] [set] [event: ${event}]`);
    console.log("Change", newValue)
    console.log("From", this.previous.length > 0 ? this.previous[0] : 'void');
    console.log("To",   newValue);
    console.groupEnd();

    this.bs.next(newValue);
  }
}
