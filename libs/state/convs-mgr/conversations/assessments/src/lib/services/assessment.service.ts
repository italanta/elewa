import { Injectable } from '@angular/core';

import { from, map, of, switchMap, take, toArray } from 'rxjs';

import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { AssessmentsStore } from '../stores/assessments.store';
import { ActiveAssessmentStore } from '../stores/active-assessment.store';

@Injectable({
  providedIn: 'root',
})
export class AssessmentService {
  constructor(private _assessments$$: AssessmentsStore,
              private _orgId$$: ActiveOrgStore,
              private _activeAssessment$$: ActiveAssessmentStore
  ) {}

  getActiveAssessment$() {
    return this._activeAssessment$$.get();
  }

  getAssessments$() {
    return this._assessments$$.get();
  }

  addAssessment$(assessment: Assessment) {
    // Create v2(micro-app enabled) assessments by default
    assessment.version == 'v2';
    return this._assessments$$.createAssessment(assessment);
  }

  updateAssessment$(assessment: Assessment) {
    return this._assessments$$.update(assessment);
  }

  deleteAssessment$(oldAssessment: Assessment) {
    return this._assessments$$.remove(oldAssessment)
  }

  getAssessmentOrg$ = () => this._orgId$$.get().pipe(take(1), map((_org) => _org.id));

  getAssessment$(assessmentId: string) {
    return this._assessments$$.getOne(assessmentId);
  }

  getPublishedAssessments$(){
    return this._assessments$$.get().pipe(
      map((assessments: Assessment[]) => assessments.filter(assessment => assessment.isPublished))
    );
  }
  
  /** Updating max scores when questions are added through question banks */
  updateMaxScore$(assessmentIds: string[], questions: AssessmentQuestion[]) {
    const totalMarks = questions.reduce((acc, question) => acc + (question.marks || 0), 0);
  
    // For each assessment ID, retrieve the assessment and update its maxScore if it's published
    return from(assessmentIds).pipe(
      switchMap((assessmentId: string) => 
        this.getAssessment$(assessmentId).pipe(
          take(1),
          switchMap((assessment) => {
            if (!assessment) {
              throw new Error(`Assessment with ID ${assessmentId} not found.`);
            }
            // Only update maxScore for published assessments
            if (assessment.isPublished) {
              assessment.maxScore += totalMarks; 
              return this.updateAssessment$(assessment).pipe(
                map(() => assessment) // Return the updated assessment
              );
            } else {
              // Skip updating maxScore for drasft assessments
              return of(assessment);
            }
          })
        )
      ),
      toArray() // Collect the results into an array to handle multiple assessments
    );
  }
  
}
