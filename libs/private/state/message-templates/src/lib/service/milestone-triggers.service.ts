import { Injectable } from '@angular/core';

import { MilestoneTriggers } from '@app/model/convs-mgr/conversations/admin/system';

import { MilestoneTriggersStore } from '../store/milestone-trigger.store';


@Injectable({
  providedIn: 'root',
})
export class MilestoneTriggersService {
  constructor(
    private _milestoneTriggerStore$$: MilestoneTriggersStore
  ) {}

  addMilestoneTrigger(milestone: MilestoneTriggers) {
    return this._milestoneTriggerStore$$.add(milestone);
  }

  fetchMileStoneTriggers(){
    return this._milestoneTriggerStore$$.get()
  }
}