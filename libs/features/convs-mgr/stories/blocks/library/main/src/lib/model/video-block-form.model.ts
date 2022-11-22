import { FormGroup,FormBuilder } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import {VideoMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
 export function _CreateVideoMessageBlockForm(_fb: FormBuilder, blockData: VideoMessageBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    fileSrc:[blockData?.fileSrc! ?? ''],
    fileName:[blockData?.fileName! ?? ''],
    type: [blockData.type ?? StoryBlockTypes.Video],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}