import { FormBuilder } from "@angular/forms";

import { QuestionButtonsBlock, TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";


export function _CreateTextMessageBlockForm(_fb: FormBuilder, blockData: TextMessageBlock) {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultPath: [blockData.defaultPath ?? ''],
    type: [blockData.type ?? 1],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}

export function _CreateQuestionBlockMessageForm<T>(_fb: FormBuilder, blockData: QuestionButtonsBlock<T>) {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultTarget: [blockData.defaultPath ?? ''],
    buttons: _fb.array([]),
    type: [blockData.type ?? 3],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}