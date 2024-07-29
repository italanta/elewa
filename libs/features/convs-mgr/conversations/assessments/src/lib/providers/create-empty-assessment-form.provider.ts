import { FormBuilder } from "@angular/forms";
import { Assessment, MoveOnCriteriaTypes, RetryType } from "@app/model/convs-mgr/conversations/assessments";
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
      retryConfig: _fb.group({
        type: [RetryType.onCount],
        onCount: [0],
        onScore: _fb.group({
          count: [0],
          minScore: [0]
        })
      }),

      moveOnCriteria: _fb.group({
        criteria: [MoveOnCriteriaTypes.OnComplete],
        passMark: ['']
      }),
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
    maxScore: 0,
    configs: {
      feedback: 1,
      retryConfig: {
        type: RetryType.onCount,
        onCount: 0,
        onScore: {
          count: 0,
          minScore: 0
        }
      },
      questionsDisplay: 1,
      moveOnCriteria: {
        criteria: MoveOnCriteriaTypes.OnPassMark,
        passMark: 0
      },
    },
    type: MicroAppTypes.Assessment, 
    callBackUrl: '', 
    channel: null as any, 
    pos: {
      storyId: '',
      blockId: ''
    } ,
  }
}