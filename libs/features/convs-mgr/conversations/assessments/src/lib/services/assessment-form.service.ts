import { Injectable } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Assessment, AssessmentQuestion, AssessmentQuestionOptions, 
  AssessmentQuestionType, 
  MoveOnCriteriaTypes,
  QuestionDisplayed} from '@app/model/convs-mgr/conversations/assessments';

@Injectable({
  providedIn: 'root'
})

export class AssessmentFormService {

  constructor(private _formBuilder: FormBuilder) {}

  createAssessmentDetailForm(assessment: Assessment){
    return this._formBuilder.group({
      id: [assessment.id ?? ''],
      title: [assessment?.title ?? ''],
      instructions: [assessment?.instructions ?? ''],
      questionsOrder: [assessment?.questionsOrder ?? []],
      configs: this._formBuilder.group({
        feedback: [assessment.configs?.feedback ?? ''],
        retryConfig: this._formBuilder.group({
          type: [assessment.configs?.retryConfig?.type ?? ''],
          onCount: [assessment.configs?.retryConfig?.onCount ?? ''],
          onScore: this._formBuilder.group({
            count: [assessment.configs?.retryConfig?.onScore?.count ?? ''],
            minScore: [assessment.configs?.retryConfig?.onScore?.minScore ?? ''],
          }),
        }),
        moveOnCriteria: this._formBuilder.group({
          criteria: [assessment.configs?.moveOnCriteria?.criteria ?? MoveOnCriteriaTypes.OnComplete],
          passMark: [assessment.configs?.moveOnCriteria?.passMark ?? '']
        }),
        questionsDisplay: [assessment.configs?.questionsDisplay ?? QuestionDisplayed.Single],
      }),
      questions: this._formBuilder.array([])
    });
  }

  createQuestionForm(question?: AssessmentQuestion, selectedOption?: any){
    return this._formBuilder.group({
      id: [question?.id ?? ''],
      questionType: AssessmentQuestionType.SingleSelectOptions,
      marks: [question?.marks ?? ''],
      message: [question?.message ?? ''],
      mediaPath: [question?.mediaPath ?? ''],
      mediaType: [question?.mediaType ?? ''],
      mediaAlign: [question?.mediaAlign ?? 'media_left'],
      options: question?.options ? this._prefillOptions(question?.options) : this._formBuilder.array([
        this.createDefaultChoice()
      ]),
      createdOn: [question?.createdOn ?? null],
      selectedOption: [selectedOption ?? "", Validators.required], //tracking the selected option
      nextQuestionId: [question?.nextQuestionId ?? null],
      prevQuestionId: [question?.prevQuestionId ?? null],
      isInBank: [question?.isInBank ?? false]
    });
  }

  createChoiceForm(questionId: string, options: FormArray) {
    return this._formBuilder.group({
      id: [`${questionId} - ${options.length + 1}`],
      text: [''],
      accuracy: [''],
      feedback: ['']
    });
  }

  createDefaultChoice() {
    return this._formBuilder.group({
      id: [`0-1`],
      text: [''],
      accuracy: [''],
      feedback: ['']
    });
  }

  private _prefillOptions(options?: AssessmentQuestionOptions[]) {
    const formArray = this._formBuilder.array<FormGroup<any>>([])

    options?.map((option) => {
      const group = this._formBuilder.group({
        id: [option?.id],
        text: [option?.text],
        accuracy: [option?.accuracy],
        feedback: [option?.feedback]
      })

      formArray.push(group);
    })

    return formArray
  }
}
