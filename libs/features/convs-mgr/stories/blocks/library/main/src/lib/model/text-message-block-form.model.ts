import { FormBuilder, FormGroup } from "@angular/forms";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { TextMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateTextMessageBlockForm(_fb: FormBuilder, blockData: TextMessageBlock): FormGroup 
{
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    type: [blockData.type ?? StoryBlockTypes.TextMessage],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}
