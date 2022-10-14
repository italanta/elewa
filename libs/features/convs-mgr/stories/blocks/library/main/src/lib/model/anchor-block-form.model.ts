import { FormBuilder, FormGroup } from "@angular/forms";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { AnchorBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateAnchorBlockForm(_fb: FormBuilder, blockData: AnchorBlock): FormGroup 
{
  return _fb.group({
    id: [blockData?.id! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    type: [blockData.type ?? StoryBlockTypes.AnchorBlock],
    position: [blockData.position ?? { x: 20, y: 20 }]
  })
}
