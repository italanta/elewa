import { FormGroup,FormBuilder } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { CMI5Block } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
 export function _CreateCmi5BlockForm(_fb: FormBuilder, blockData: CMI5Block): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    message: [blockData?.message! ?? ''],
    fileSrc:[blockData?.fileSrc! ?? ''],
    type: [blockData.type ?? StoryBlockTypes.CMI5Block],
    position: [blockData.position ?? { x: 200, y: 50 }],
    options: _fb.array([]),
  })
}