import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { take, map, switchMap, tap } from "rxjs/operators";

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Story } from "@app/model/convs-mgr/stories/main";

import { ActiveOrgStore } from "@app/state/organisation";
import { StoriesStore } from "@app/state/convs-mgr/stories";

/** Service which can create new stories. */
@Injectable()
export class NewStoryService
{
  constructor(private _org$$: ActiveOrgStore,
              private _stories$$: StoriesStore,
              private _router: Router)
  {}

  add(name?: string) {
    // Generate default name if name not passed.
    if(!name)
      name = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

    return this._getOrgId$()
               .pipe(
                switchMap((orgId) =>
                  this._stories$$.add({ name: name as string, orgId } as Story)),
                tap((s: Story) =>
                  this._router.navigate(['/stories', s.id])))


  }

  private _getOrgId$ = () => this._org$$.get().pipe(take(1), map(o => o.id));

  generateName(){
    const defaultName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    return defaultName;
  }
}
