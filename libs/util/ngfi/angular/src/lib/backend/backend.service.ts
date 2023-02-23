import { Inject, Injectable } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/compat/functions';

/**
 * Interface with the firebase backend.
 */
@Injectable({ providedIn: 'root' })
export class BackendService {
  constructor(
    private _fns: AngularFireFunctions,
    @Inject('ENVIRONMENT') private _env: any) { }

  /**
   * Call Firebase Cloud Function
   *
   * @param fName:  Function Name
   * @param params: Function Parameter Object
   */
  callFunction(fName: string, params: any) {
    const toCall = this._fns.httpsCallable(fName);
    return toCall(params);
  }

}
