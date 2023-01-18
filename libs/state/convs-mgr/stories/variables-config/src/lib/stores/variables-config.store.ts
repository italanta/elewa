import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { VariablesConfig } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';

@Injectable({
  providedIn:"root"
})
export class VariablesConfigStore extends DataStore<VariablesConfig>
{
  protected store = 'story-variables-store';
  protected _activeRepo: Repository<VariablesConfig>;

  constructor(_story$$: ActiveStoryStore,
    _repoFac: DataService,
    _logger: Logger) {
    super("always", _logger);

    const data$ = _story$$.get()
      .pipe(
        tap((story: Story) => this._activeRepo = _repoFac.getRepo<VariablesConfig>(`orgs/${story.orgId}/stories/${story.id}/config`)),
        switchMap((story: Story) =>
          story ? this._activeRepo.getDocumentById('variables') : of([] as any[])),
          throttleTime(400, undefined, { leading: true, trailing: true }));


    this._sbS.sink = data$.subscribe(variables => {
      this.set(variables, 'UPDATE - FROM DB');
    });
  }
}