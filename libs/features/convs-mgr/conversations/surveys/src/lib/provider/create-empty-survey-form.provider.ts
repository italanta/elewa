import { FormBuilder } from "@angular/forms";
import { Survey } from "@app/model/convs-mgr/conversations/surveys";

export function CREATE_EMPTY_SURVEY_FORM(_fb: FormBuilder) {
  return _fb.group({
    // main part of form
    title: [''],
    description: [''],

    questionsOrder: [[]],

    // configs
    configs: _fb.group({
      feedback: [''],
      userAttempts: ['']
    }),

    // quizzes
    questions: _fb.array([])
  })
}

export function DEFAULT_SURVEY(): Survey {
  return {
    title: '',
    orgId: '',
    description: '',
    configs: {
      feedback: 1,
      userAttempts: 1
    },
  }
}