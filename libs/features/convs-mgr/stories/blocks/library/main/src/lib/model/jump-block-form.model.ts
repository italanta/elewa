import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { JumpBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateJumpBlockForm(_fb: FormBuilder, blockData: JumpBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    targetStoryId: [blockData?.targetStoryId],
    targetBlockId: [blockData?.targetBlockId],
    options: _fb.array([]),
    type: [blockData.type ?? StoryBlockTypes.JumpBlock],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}