import { Injectable } from '@angular/core';
import { concatMap, from, Observable, of } from 'rxjs';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionStore } from '../stores/assessment-question.store';
import { AssessmentQuestionService } from './assessment-question.service';

@Injectable({
  providedIn: 'root'
})
export class AssessmentQuestionBankService {

  constructor(private _questionBank$$: AssessmentQuestionStore, 
              private _assessmentQuestionService$: AssessmentQuestionService) {}

  addQuestions$(questions: AssessmentQuestion[]){
    return this._questionBank$$.addMultiple(questions, true);
  }

  getQuestions$(){
    return this._questionBank$$.get();
  }
  
  addQuestionToAssessment$(assessmentId: string, questions: AssessmentQuestion[]): Observable<void> {
    return from(questions).pipe(
      concatMap((question: AssessmentQuestion) => {
      this._assessmentQuestionService$.addQuestion$(assessmentId, question, question.id as string);
        return of(void 0); // Emit a void observable to keep the chain going
      })
    );
  }
  
  addQuestion$(question: AssessmentQuestion) {
    return this._questionBank$$.add(question);
  }

  updateQuestion$(question: AssessmentQuestion){
    return this._questionBank$$.update(question);
  }

  deleteQuestion$(oldQuestion: AssessmentQuestion) {
    return this._questionBank$$.remove(oldQuestion);
  }
}
