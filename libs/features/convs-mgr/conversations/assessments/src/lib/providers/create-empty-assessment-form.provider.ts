import { FormBuilder } from "@angular/forms";
import { Assessment } from "@app/model/convs-mgr/conversations/assessments";

export function CREATE_EMPTY_ASSESSMENT_FORM(_fb: FormBuilder) {
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

export function DEFAULT_ASSESSMENT(): Assessment {
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