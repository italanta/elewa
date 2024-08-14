import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'lib-question-bank-header',
  templateUrl: './question-bank-header.component.html',
  styleUrl: './question-bank-header.component.scss',
})
export class QuestionBankHeaderComponent 
{

  @Output() addNewQuestion = new EventEmitter<FormGroup>();
  @Output() addMode = new EventEmitter<boolean>();

  addQuestionBank(){
    //
  }
}
