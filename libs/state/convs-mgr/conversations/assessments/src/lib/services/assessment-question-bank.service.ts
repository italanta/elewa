import { Injectable } from '@angular/core';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionStore } from '../stores/assessment-question.store';

@Injectable({
  providedIn: 'root'
})
export class AssessmentQuestionBankService {

  constructor(private _questionBank$$: AssessmentQuestionStore) {}

  addQuestions$(questions: AssessmentQuestion[]){
    return this._questionBank$$.addMultiple(questions, true);
  }

  getQuestions$(){
    return this._questionBank$$.get();
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
