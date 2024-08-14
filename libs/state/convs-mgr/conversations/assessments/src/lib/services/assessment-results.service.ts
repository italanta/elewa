import { Injectable } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AssessmentResultResponse, AssessmentUserResultResponse } from '@app/model/convs-mgr/micro-app/assessments';

@Injectable({
  providedIn: 'root'
})
export class AssessmentResultsService
{
  constructor(private _aff$: AngularFireFunctions) { }

  getResults(id: string)
  {
    return this._aff$.httpsCallable<any, AssessmentResultResponse>('getAssessmentResults')({id});
  }
  getUsers(id: string)
  {
    return this._aff$.httpsCallable<any, AssessmentUserResultResponse>('getAssessmentUsers')({id});
  }
}