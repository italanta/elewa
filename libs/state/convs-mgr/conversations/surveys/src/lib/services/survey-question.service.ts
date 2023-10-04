import { Injectable } from '@angular/core';

import { take } from 'rxjs';

import { SurveyQuestion } from '@app/model/convs-mgr/conversations/surveys';

import { SurveyQuestionStore } from '../stores/survey-question.store';

@Injectable({
  providedIn: 'root'
})
export class SurveyQuestionService {

  constructor(private _surveyQuestion$$: SurveyQuestionStore) {}

  addQuestions$(questions: SurveyQuestion[]){
    return this._surveyQuestion$$.addMultiple(questions, true);
  }

  getQuestions$(){
    return this._surveyQuestion$$.get();
  }

  getQuestionsBySurveyId$(surveyId: string){
    return this._surveyQuestion$$.getQuestionsBySurvey(surveyId).pipe(take(1));
  }

  addQuestion$(surveyId: string, question: SurveyQuestion, questionId: string) {
    return this._surveyQuestion$$.createSurveyQuestion(surveyId, question, questionId);
  }

  updateQuestion$(question: SurveyQuestion){
    return this._surveyQuestion$$.update(question);
  }

  deleteQuestion$(oldQuestion: SurveyQuestion) {
    return this._surveyQuestion$$.remove(oldQuestion);
  }
}
