import { Inject, Injectable } from '@angular/core';

import { Functions, httpsCallable } from '@angular/fire/functions';

/**
 * Interface with the firebase backend.
 */
@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(
    private _fns: Functions,
    @Inject('ENVIRONMENT') private _env: any) { }

  /**
   * Call Firebase Cloud Function
   *
   * @param fName:  Function Name
   * @param params: Function Parameter Object
   */
  callFunction(fName: string, params: any) {
    const toCall = httpsCallable(this._fns, fName);
    return toCall(params);
  }

}
