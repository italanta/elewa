import { CollectionReference } from '@firebase/firestore-types';

import { orderBy as ___orderBy } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection, DocumentData, QuerySnapshot  } from '@angular/fire/compat/firestore';

import { IObject } from '@iote/bricks';

import { PaginationConfig } from './pagination-config.interface';

/**
 * Model for a paginated endless scroll linked to the DB.
 *
 * Used in e.g. scrolling through the chats.
 *
 * @see https://fireship.io/lessons/infinite-scroll-firestore-angular/ - Inspiration for this design.
 * @see https://medium.com/@650egor/firestore-reactive-pagination-db3afb0bf42e for making it work properly
 *
 * @export
 * @class PaginatedScroll
 */
export class PaginatedScroll<T extends IObject>
{
  /** List of Messages */
  docs: T[] = [] as any[];
  docs$$ = new BehaviorSubject<T[]>(null as any);

  /** Firebase active db listeners (on segments of the db) */
  listeners = [] as any[];

  /** Start & End position of the listener */
  start = null as any;
  end = null as any;

  constructor(private _opts: PaginationConfig,
              private _afs: AngularFirestore)
  { }

  get()
  {
    const collection = this._getMessageCollection();

    // 1. Configure query behaviour
    const docs$ = collection.orderBy(this._opts.orderByField, this._opts.reverse ? 'desc' : 'asc')
                            .limit(this._opts.limit).get();

    // 2. Get a single snapshot. Will only fire once on get!
    docs$.then((snapshots) => {
        // 2.1. The goal of this startAt is to identify the end position of the first listener (the listener which does not have a left boundary).
        this.start = snapshots.docs[snapshots.docs.length - 1];

        // create listener using startAt snapshot (starting boundary)
        const listener = collection
                            // 2.2. Our start listener is different from the snapshot as it is sorted in the opposite way.
                            .orderBy(this._opts.orderByField, this._opts.reverse ? 'asc' : 'desc')
                            //      We only set a startAt param and no limit so that we keep adding the newest messages.
                            .startAt(this.start)
                            //      Whenever a new message comes in or one of the messages is updated, we process the change.
                            .onSnapshot((docs) => this._processDataChange(docs));

      // 3. Add our listener to the list of listeners (to later deactivate all on destroy).
      this.listeners.push(listener);
    });

    // 4. The _processDataChanges will manage our documents behaviour subject.
    //    Return an active subject that has all the data.
    return this.docs$$.asObservable().pipe(filter(o => o != null));
  }

  more() : void
  {
    const collection = this._getMessageCollection();

    // 1. Configure next query behaviour
    const docs$ = collection.orderBy(this._opts.orderByField, this._opts.reverse ? 'desc' : 'asc')
                                .startAt(this.start)
                                .limit(this._opts.limit).get();

    // 2. Get the next snapshot. Will only fire once on get!
    docs$.then((snapshots) => {
      // previous starting boundary becomes new ending boundary
      this.end = this.start;
      this.start = snapshots.docs[snapshots.docs.length - 1];

      // create another listener using new boundaries
      const listener = collection.orderBy(this._opts.orderByField, this._opts.reverse ? 'asc' : 'desc')
                                 .startAt(this.start)
                                 .endBefore(this.end)
                                 .onSnapshot((docs) => this._processDataChange(docs));

      this.listeners.push(listener);
    });
  }


  /** Reducer that turns path e.g. ['chats', chatId, 'messages'] into a firebase doc ref. */
  private _getMessageCollection() : CollectionReference
  {
    const coll = 
      (this._opts.path.reduce(
        // Reducer fn
        ({ db, mode }, path) => mode === 'coll' ? ({ db: db.collection(path), mode: 'doc' })
                                                : ({ db: db.doc(path), mode: 'coll' }) as any,
        // Start val
        { db: this._afs, mode: 'coll' })
      .db
    ) as unknown as AngularFirestoreCollection<T>;

    return coll.ref;
  }

  /** Processes a change in one of the data listeners. Updates the total loaded data. */
  private _processDataChange(data: QuerySnapshot<DocumentData>)
  {
    for(const doc of data.docs)
    {
      // filter out any duplicates (from modify/delete events)
      this.docs = this.docs.filter(x => x.id !== doc.id);
      this.docs.push({ id: doc.id, ...doc.data() } as T);
    }

                                             // orderByFn converts value into orderable value e.g. __DateFromStorage
    this.docs = ___orderBy(this.docs, m => this._opts.orderByFn((m as any)[this._opts.orderByField]), this._opts.prepend ? 'asc' : 'desc');
    this.docs$$.next(this.docs);
  }

  // call to detach all listeners
  detachListeners()
  {
    this.listeners.forEach((listener: any) => listener())
  }

}
