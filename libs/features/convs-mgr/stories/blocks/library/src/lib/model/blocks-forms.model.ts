import { FormBuilder } from "@angular/forms";

import { QuestionMessageBlock, TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";


export function _CreateTextMessageBlockForm(_fb: FormBuilder, blockData: TextMessageBlock) {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultTarget: [''],
    type: [blockData.type ?? 1],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}

export function _CreateQuestionBlockMessageForm(_fb: FormBuilder, blockData: QuestionMessageBlock) {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultTarget: [''],
    options: _fb.array([]),
    type: [blockData.type ?? 3],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}