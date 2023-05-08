import { Injectable } from '@angular/core';
import { AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private _assessments$$: AssessmentsStore) { }

  getAssessments$(){
    return this._assessments$$.get();
  }
  
}
