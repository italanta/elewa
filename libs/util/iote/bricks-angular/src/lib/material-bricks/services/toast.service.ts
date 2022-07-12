import { MatSnackBar } from "@angular/material/snack-bar";
import { inject, Injectable } from '@angular/core';

/**
 * Service that shows a Toast to the user, warning him/her of a certain event.
 *
 * Uses Angular Material Snackbar internally: https://material.angular.io/components/snack-bar/overview
 */
@Injectable()
export class ToastService 
{
  /**
   * Show a simple toast
   * @param message The message to show
   * @param duration The duration you want to show the message, in milliseconds
   */
  doSimpleToast(message: string, duration?: number) 
  {
    let durationToShow = 4000;
    if (duration) {
      durationToShow = duration;
    }

    // MatSnackBar exhibits a known issue with injector behaviour. We therefore have to wrap the fn into an injector at runtime.
    // TODO: Fix service
    const doSnackbar = () => 
    {
        // Simple message.
      const snackbar = inject(MatSnackBar);
      snackbar.open(message, "Close", {
        duration: durationToShow,
        verticalPosition: "top",
        horizontalPosition: "center"
      });
    }

    doSnackbar();
      // // Simple message with an action.
      // let snackBarRef = snackBar.open("Message archived", "Undo");

      // // Load the given component into the snack-bar.
      // let snackBarRef = snackbar.openFromComponent(MessageArchivedComponent);
  }

}
