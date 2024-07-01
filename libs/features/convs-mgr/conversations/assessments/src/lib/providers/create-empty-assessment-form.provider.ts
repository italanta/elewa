import { FormBuilder } from "@angular/forms";
import { Assessment } from "@app/model/convs-mgr/conversations/assessments";
import { MicroAppTypes } from "@app/model/convs-mgr/micro-app/base";

export function CREATE_EMPTY_ASSESSMENT_FORM(_fb: FormBuilder) {
  return _fb.group({
    // main part of form
    title: [''],
    instructions: [[]],
    description: [''],

    questionsOrder: [[]],

    // configs
    configs: _fb.group({
      feedback: [''],
      userAttempts: [''],
      canRetry: [''],
      retryType: [''],
      questionsDisplay: [''],
      scoreAttempts: _fb.group({
        minScore: [''],
        userAttempts: [''],
      }),
    }),

    /** Micro-app relevant configs */
    type: MicroAppTypes.Assessment,
    callBackUrl: [''], 
    channelId: [''], 
    pos: _fb.group({ 
      storyId: [''],
      blockId: ['']
    }),
    // quizzes
    questions: _fb.array([])
  })
}

export function DEFAULT_ASSESSMENT(): Assessment {
  return {
    title: '',
    instructions: [],
    orgId: '',
    description: '',
    configs: {
      feedback: 1,
      userAttempts: 1,
      retryType: 1,
      canRetry: false,
      questionsDisplay: 1,
      scoreAttempts: {
        minScore: 1,
        userAttempts: 1
      }
    },
    type: MicroAppTypes.Assessment, 
    callBackUrl: '', 
    channelId: '', 
    pos: {
      storyId: '',
      blockId: ''
    } ,
  }
}