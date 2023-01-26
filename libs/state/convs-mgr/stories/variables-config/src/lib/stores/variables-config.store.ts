import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { EntityStore } from '@iote/state';

import { of, } from 'rxjs'
import { tap, map, switchMap, filter } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { Variable } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';


@Injectable({
  providedIn: "root"
})
export class VariablesConfigStore extends EntityStore<Variable>
{
  protected store = 'story-variables-store';
  protected _activeRepo: Repository<Variable>;

  constructor(_story$$: ActiveStoryStore,
    _repoFac: DataService,
    _logger: Logger) {
    super([]);

    const data$ = _story$$.get()
      .pipe(
        tap((story: Story) => this._activeRepo = _repoFac.getRepo<any>(this.getPath(story))),
        switchMap((story: Story) => story ? this._activeRepo.getDocumentById('variables') : of({} as any)),
        filter((variables: { [varName: string]: [varValue: any] }) => !!variables),
        map((variables: { [varName: string]: [varValue: any] }) => {
          const variablesList: Variable[] = [];
          Object.keys(variables).map((key) => variablesList.push({
            name: key,
            value: variables[key]
          }))
          return variablesList;
        })
      )


    this._sbS.sink = data$.subscribe(variables => {
      this.set(variables, 'UPDATE - FROM DB');
    });
  }

  getPath = (story: Story) => `orgs/${story.orgId}/stories/${story.id}/config`

}