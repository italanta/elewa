import { Injectable } from '@angular/core';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  constructor(private _assessments$$: AssessmentsStore) { }

  getAssessments$(){
    return this._assessments$$.get();
  }

  addAssessment$(assessment: Assessment){
    return this._assessments$$.add(assessment);
  }

  getAssessment$(assessmentId: string){
    return this._assessments$$.getOne(assessmentId);
  }
  
}
