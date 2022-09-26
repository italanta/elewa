import { concat as ___concat } from 'lodash';
import { Observable, combineLatest, throwError } from 'rxjs';
import { catchError, map, filter, debounceTime } from 'rxjs/operators';

import { Repository } from '@ngfi/angular';
import { EntityStore, StoreEventTypes } from '@iote/state';

import { IObject } from '@iote/bricks';
import { Logger } from '@iote/bricks-angular';

// import { ToastService } from '@iote/bricks-angular';

/**
 * @export
 * @abstract
 * @class DataStore
 * @extends {EntityStore<T>}
 * @template T
 */
export abstract class DataStore<T extends IObject> extends EntityStore<T>
{
  protected abstract _activeRepo: Repository<T>;

  /**
   * @param _notifyChanges - Show Toast/Notification whenever an update occurs.
   * @param _logger
   * @param initialValues
   */
  constructor(//private _notifications: ToastService,
              private _notifyChanges: 'always' | 'error' | 'none',
              protected _logger: Logger)
  {
    super([], true);
  }

  override get(entityFilter? : (t: T) => boolean) : Observable<T[]>
  {
    return this.state$.pipe(debounceTime(400),
                            filter(state => !state.loading),
                            map(state => entityFilter ? state.entities.filter(entityFilter)
                                                      : state.entities));
  }

  override set(newValues: Partial<T[]> | any, event: StoreEventTypes = "Not Specified")
  {
    super.set(newValues, event);
  }

  public getOne  = (id: string) => this.get().pipe(map(all => all.find(one => one.id === id)));
  public getMany = (ids: string[]) => this.get().pipe(map(all => all.filter(one => ids.find(id => id === one.id) != null)));

  //
  // SECTION - ADD

  public addMultiple(entities: T[], setIds = false) : Observable<T[]>
  {
    return combineLatest(entities.map(e => setIds ? this.add(e,e.id) : this.add(e)));
  }

  public add(entity: T, id?: string) : Observable<T>
  {
    if(id) {
       // Only optimistic UI if we know ID as we don't want possibility to link to non-existing IDs
      entity.id = id;
      this._addLocal(entity, `Optimistic UI - Add new known value with id ${id}.`);
    }

    return this._activeRepo.create(entity, id)
                           .pipe(// this._notifications.notifySuccess()),
                                 catchError((err) => this._errorAdd(entity, err)));
  }

  private _errorAdd(entity: T, error:any)
  {
    this._removeLocal(entity, 'DB Error onAdd - Rollback.');

    // this._notifications.notifyFailure()),
    return throwError(error);
  }

  //
  // SECTION - UPDATE

  public update(entity: T) : Observable<T>
  {
    const prev = this.state.entities.find(e => e.id = entity.id) as T;
    this._updateLocal(entity, 'Optimistic UI. Process changes.');

    return this._activeRepo
                    .update(entity)
                    .pipe(// tap this._notifications.notifySuccess()),
                          catchError((err) => this._errorUpdate(prev, err)));
  }

  private _errorUpdate(rollbackTo: T, error:any) : Observable<T>
  {
    this._updateLocal(rollbackTo, 'DB Error onUpdate - Rollback.');
    // this._notifications.notifyFailure()),
    return throwError(error);
  }

  //
  // SECTION - REMOVE

  public removeMultiple(entities: T[]) : Observable<T[]>
  {
    return combineLatest(entities.map(e => this.remove(e)));
  }

  public remove(entity: T) : Observable<T>
  {
    const prev = this.state.entities.find(e => e.id = entity.id) as T;
    this._removeLocal(entity, 'Optimistic UI - Add new value');

    return this._activeRepo
                    .delete(entity)
                    .pipe(// this._notifications.notifySuccess()),
                          catchError((err:any) => this._errorRemove(prev, err)));
  }

  private _errorRemove(entity: T, error:any) : Observable<T>
  {
    this._addLocal(entity, 'DB Error onRemove - Rollback.');

    // this._notifications.notifyFailure()),
    return throwError(error);
  }

  //
  // SECTION - STATE HELPERS

  private _addLocal(value: T, msg: string)
  {
    const next = ___concat(this.state.entities, value);

    return this.set(next, msg);
  }

  private _updateLocal(value: T, msg: string)
  {
    // Remove then add -> Not calling other helpers to avoid effects of two state recalculations.
    const prevWithout = this.state.entities.filter(t => t.id !== value.id);
    const next = ___concat(prevWithout, value);

    return this.set(next, msg);
  }

  private _removeLocal(value: T, msg: string)
  {
    const next = this.state.entities.filter(t => t.id !== value.id);
    return this.set(next, msg);
  }

}
