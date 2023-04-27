import { FormBuilder, FormGroup } from "@angular/forms";
import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";

import { EventBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateEventBlockForm(_fb: FormBuilder, blockData: EventBlock): FormGroup 
{
  return _fb.group({
    id: [blockData?.id! ?? ''],
    message: [blockData?.message! ?? ''],
    eventName: [blockData?.eventName! ?? ''],
    isMilestone: [blockData?.isMilestone! ?? false],
    payLoad: [blockData?.payLoad! ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    type: [blockData.type ?? StoryBlockTypes.Event],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}
