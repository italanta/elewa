import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { take, map, switchMap, tap } from "rxjs/operators";

import { Injectable, OnDestroy  } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SubSink } from 'subsink';

import { ToastService } from '@iote/bricks-angular';
import { Story } from "@app/model/convs-mgr/stories/main";

import { ActiveOrgStore } from "@app/state/organisation";
import { StoriesStore } from "@app/state/convs-mgr/stories";

/** Service which can create new stories. */
@Injectable()
export class NewStoryService implements OnDestroy
{
  private _sbS = new SubSink();

  constructor(
    private _org$$: ActiveOrgStore,
    private _stories$$: StoriesStore,
    private _router: Router,
    private dialog: MatDialog,
    private _notifications: ToastService
  ){}

  add(name?: string, description?: string) {
    // Generate default name if name not passed.
    if(!name)
      name = this.generateName();

    return this._getOrgId$()
               .pipe(
                switchMap((orgId) =>
                  this._stories$$.add({ name: name as string, orgId, description } as Story)),
                tap((s: Story) => {
                  this.dialog.closeAll()
                  this._router.navigate(['/stories', s.id])
                }
                ))


  }

  remove(story: Story) {
    this._sbS.sink = this._stories$$.remove(story).subscribe({
      error: () => {
        this._notifications.doSimpleToast("An error occured, Try again")
      },
      complete: () =>  {
        this.dialog.closeAll()
        this._notifications.doSimpleToast("Bot was successfully deleted")
      },
    });
  }

  private _getOrgId$ = () => this._org$$.get().pipe(take(1), map(o => o.id));

  generateName(){
    const defaultName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
    return defaultName;
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
