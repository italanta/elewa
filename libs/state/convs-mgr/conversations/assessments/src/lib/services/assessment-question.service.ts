import { Injectable } from '@angular/core';

import { AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentQuestionStore } from '../stores/assessment-question.store';

@Injectable({
  providedIn: 'root'
})
export class AssessmentQuestionService {

  constructor(private _assessmentQuestion$$: AssessmentQuestionStore) {}

  addQuestions$(questions: AssessmentQuestion[]){
    return this._assessmentQuestion$$.addMultiple(questions, true);
  }

  getQuestions$(){
    return this._assessmentQuestion$$.get();
  }

  addQuestion$(question: AssessmentQuestion, questionId: string) {
    return this._assessmentQuestion$$.add(question, questionId);
  }

  updateQuestion$(question: AssessmentQuestion){
    return this._assessmentQuestion$$.update(question);
  }

  deleteQuestion$(oldQuestion: AssessmentQuestion) {
    return this._assessmentQuestion$$.remove(oldQuestion);
  }
}
