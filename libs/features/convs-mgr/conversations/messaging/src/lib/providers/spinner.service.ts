import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private unBlockState$ = new BehaviorSubject(false);
  readonly showSpinner = this.unBlockState$.asObservable();

  /**
   * Show spinner
   */
  public show() {
    this.unBlockState$.next(true);
  }

   /**
   * hide spinner
   */
  public hide() {
    this.unBlockState$.next(false);
  }
}
