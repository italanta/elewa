import { Injectable } from '@angular/core';

import { concatMap, of } from 'rxjs';

import { MilestoneTriggers } from '@app/model/convs-mgr/conversations/admin/system';

import { MilestoneTriggersStore } from '../store/milestone-trigger.store';

@Injectable({
  providedIn: 'root',
})
export class MilestoneTriggersService
{
  constructor(
    private _milestoneTriggerStore$$: MilestoneTriggersStore
  ) { }

  addMilestoneTrigger(milestone: MilestoneTriggers)
  {
    return this._milestoneTriggerStore$$.add(milestone);
  }

  removeMilestoneTrigger(id: string)
  {
    return this._milestoneTriggerStore$$.getOne(id).pipe(concatMap((mt) => 
    {
      if (mt) {
        return this._milestoneTriggerStore$$.remove(mt as MilestoneTriggers);
      } else {
        return of(null)
      }
    }
    ));
  }
}