import { FormBuilder, FormGroup } from "@angular/forms";

import { QuestionMessageBlock, TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateTextMessageBlockForm(_fb: FormBuilder, blockData: TextMessageBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    type: [blockData.type ?? 1],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateQuestionBlockMessageForm(_fb: FormBuilder, blockData: QuestionMessageBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    options: _fb.array([]),
    type: [blockData.type ?? 3],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}