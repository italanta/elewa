import { Observable, BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';

import { Stateful } from './stateful.interface';

export type StoreEventTypes = 'Not Specified' | 'Create' | 'Update' | 'Delete' | string;

export abstract class Store<T> implements Stateful<T>
{
  protected _sbS = new SubSink();

  protected bs: BehaviorSubject<T>;
  protected state$: Observable<T>;

  state: T;
  previous: T[] = [];

  protected abstract store: string;

  constructor(initialValue: Partial<T>)
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

  protected patch(newValue: Partial<T> | any, event: StoreEventTypes = "Not Specified")
  {
    this.previous.unshift(this.state);
    const newState = Object.assign({}, this.state, newValue);

    console.groupCollapsed(`[${this.store} store] [patch] [event: ${event}]`);
    console.log("Change", newValue)
    console.log("from", this.previous.length > 0 ? this.previous[0] : 'void');
    console.log("to",   newState);
    console.groupEnd();

    this.bs.next(newState);
  }

  set(newValue: Partial<T>, event: StoreEventTypes = "Not Specified")
  {
    this.previous.unshift(this.state);
    const newState = Object.assign({}, newValue) as T;

    console.groupCollapsed(`[${this.store} store] [set] [event: ${event}]`);
    console.log("Change", newValue)
    console.log("From", this.previous.length > 0 ? this.previous[0] : 'void');
    console.log("To",   newState);
    console.groupEnd();

    this.bs.next(newState);
  }

}
