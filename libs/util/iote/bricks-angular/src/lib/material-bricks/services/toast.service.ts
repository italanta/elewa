import { MatSnackBar } from "@angular/material/snack-bar";
import { Injectable } from '@angular/core';

/**
 * Service that shows a Toast to the user, warning him/her of a certain event.
 *
 * Uses Angular Material Snackbar internally: https://material.angular.io/components/snack-bar/overview
 */
@Injectable()
export class ToastService {

  constructor(private _snackBar: MatSnackBar) { }


  /**
   * Show a simple toast
   * @param message The message to show
   * @param duration The duration you want to show the message, in milliseconds
   */
  doSimpleToast(message: string, duration?: number) {
      let durationToShow = 4000;
      if (duration) {
          durationToShow = duration;
      }
      // Simple message.
      this._snackBar.open(message, "Close", {
          duration: durationToShow,
          verticalPosition: "top",
          horizontalPosition: "center"
      });

      // // Simple message with an action.
      // let snackBarRef = snackBar.open("Message archived", "Undo");

      // // Load the given component into the snack-bar.
      // let snackBarRef = snackbar.openFromComponent(MessageArchivedComponent);
  }

}
