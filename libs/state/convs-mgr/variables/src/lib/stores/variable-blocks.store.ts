/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { combineLatest, of } from 'rxjs'
import { tap, throttleTime, switchMap, map, take } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable()
export class variableBlocksStore extends DataStore< StoryBlockVariable>
{
  protected store = 'blocks-variable-store';
  protected _activeRepo: Repository< StoryBlockVariable>;

  private _activeStory: Story;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(
    private _story$$: ActiveStoryStore,
    private _activeOrgStore$$: ActiveOrgStore,
    private _repoFac: DataService,
     _logger: Logger
  ) {
    super('always', _logger);

    const activeOrg$ = this._activeOrgStore$$.get();

    const data$ = combineLatest([activeOrg$, _story$$.get()]).pipe(
      tap(([org, story]) => {
        this._activeStory = story;
        this._activeRepo = _repoFac.getRepo<StoryBlockVariable>(`orgs/${org.id}/variables`);
      }),
      switchMap(([org, story]) =>
        story ? this._activeRepo.getDocuments() : of([] as StoryBlockVariable[])
      ),
      throttleTime(400, undefined, { leading: true, trailing: true })
    );

    this._sbS.sink = data$.subscribe((properties) => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }
  write(block: StoryBlockVariable, id: string) {
    return this._activeRepo.write(block, id);
  }

  // TODO:@JAPHETHNYARANGA: delete this method and use the get method from the data store to fetch the variables, and then filter them by botID in your service
  getBotVariables(botId?:string,orgId?:string){
    const repo = this._repoFac.getRepo<StoryBlockVariable>(`orgs/${orgId}/variables`);

    return repo.getDocuments().pipe(
      map((variables) => variables.filter((variable) => variable.botId === botId))
    );
  }

}
