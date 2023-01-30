import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { EmailMessageBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateEndStoryAnchorBlockForm(_fb: FormBuilder, blockData: EmailMessageBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    deleted: [false],
    type: [blockData.type ?? StoryBlockTypes.EndStoryAnchorBlock],
    position: [blockData.position ?? { x: 50, y: 150 }]
  })
}