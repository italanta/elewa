import { FormGroup,FormBuilder } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { ImageMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
 export function _CreateImageMessageBlockForm(_fb: FormBuilder, blockData: ImageMessageBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    caption: [blockData?.message! ?? ''],
    imageLink:[blockData?.fileSrc],
    type: [blockData.type ?? StoryBlockTypes.Image],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}