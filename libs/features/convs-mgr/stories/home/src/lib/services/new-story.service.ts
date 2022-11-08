import { uniqueNamesGenerator, adjectives, colors, animals } from "unique-names-generator";
import { take, map, switchMap, tap } from "rxjs/operators";

import { Injectable, OnDestroy  } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { SubSink } from 'subsink';

import { ToastService } from '@iote/bricks-angular';
import { TranslateService } from '@ngfi/multi-lang';
import { Story } from "@app/model/convs-mgr/stories/main";

import { ActiveOrgStore } from "@app/state/organisation";
import { StoriesStore } from "@app/state/convs-mgr/stories";

/** Service which can create new stories. */
@Injectable()
export class NewStoryService implements OnDestroy
{
  constructor(private _org$$: ActiveOrgStore,
              private _stories$$: StoriesStore,
              private _router: Router,
              private _toast: ToastService,
              private _translate: TranslateService,
              private _dialog: MatDialog)
  {}
  private _sbS = new SubSink();

  add(name?: string, description?: string) {
    // Generate default name if name not passed.
    if(!name)
      name = this.generateName();

    return this._getOrgId$()
               .pipe(
                switchMap((orgId) =>
                  this._stories$$.add({ name: name as string, orgId, description } as Story)),
                tap((s: Story) => {
                  this._dialog.closeAll()
                  this._router.navigate(['/stories', s.id])
                }
                ))


  }

  update(story: Story) {
    this._stories$$.update(story).subscribe(() => {
      try {
        this._dialog.closeAll();
        this._toast.doSimpleToast(this._translate.translate('TOAST.EDIT-BOT.SUCCESSFUL'));
      } catch (error) {
        this._toast.doSimpleToast(this._translate.translate('TOAST.EDIT-BOT.FAIL'));
      }
    });
  }

  remove(story: Story) {
    this._sbS.sink = this._stories$$.remove(story).subscribe({
      error: () => {
        this._toast.doSimpleToast(
          this._translate.translate("TOAST.DELETE-BOT.SUCCESSFUL")
        );
      },
      complete: () =>  {
        this._dialog.closeAll()
        this._toast.doSimpleToast(
          this._translate.translate("TOAST.DELETE-BOT.FAIL")
        );
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
