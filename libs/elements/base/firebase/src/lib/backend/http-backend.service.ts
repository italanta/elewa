import { map } from 'rxjs';
import { getAuth } from 'firebase/auth';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserStore } from '@app/state/user';


/**
 * Interface with the firebase backend using HTTP functions
 */
@Injectable({ providedIn: 'root' })
export class HttpBackendService 
{
  constructor(
    private _http$$: HttpClient,
    @Inject('ENVIRONMENT') private _env: any) 
  { }

  /**
   * Call Firebase Cloud Function
   *
   * @param fName:  Function Name
   * @param body:   Body to call the fn with
   */
  callBackend(fName: string, body: any) 
  {
    const url = `${this._env['backendUrl']}/${fName}`;
    const userToken = this._getUserToken();

    // Add User auth token if we have logged-in user
    const config = !!userToken ? { headers: { 'Authorisation': `Bearer ${userToken}` } }
                               : {};

    return this._http$$.post(url, body, config);
  }

  /** Extract the user token from firebase */
  private _getUserToken()
  {
    const user = getAuth().currentUser;
    return !!user ? user.getIdToken() : null;
  }

}
