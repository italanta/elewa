import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root'
})
export class CheckStoryErrorsService {

  constructor(private _aFF: AngularFireFunctions) { }

  fetchFlowErrors(OrgId: string, storyId: string) {
    const callable = this._aFF.httpsCallable('checkStoryErrors');
    return callable({OrgId, storyId});
  }
}
