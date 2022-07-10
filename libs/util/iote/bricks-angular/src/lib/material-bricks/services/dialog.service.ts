import { Injectable, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SubSink } from 'subsink';

/**
 * Service that shows a Dialog to the user, to create or edit objects.
 *
 * Uses Angular Material Dialog internally: https://material.angular.io/components/dialog/overview
 */
@Injectable()
export class DialogService implements OnDestroy
{
  private _sbS = new SubSink();

  constructor(private _dialog: MatDialog) { }

  showDialog(dialogClass:any, data?:any)
  {
    let dialogData = {};

    if (data) {
        dialogData = data;
    }
    const dialogRef = this._dialog.open(dialogClass, {
        width: '400px',
        data: dialogData
    });

    this._sbS.sink = dialogRef.afterClosed()
                              .subscribe(result => { });
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }

}
