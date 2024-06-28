import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlock, StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { EndStoryAnchorBlock } from "@app/model/convs-mgr/stories/blocks/structural";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateEndStoryAnchorBlockForm(_fb: FormBuilder, blockData: StoryBlock): FormGroup 
{
  const block = blockData as EndStoryAnchorBlock;

  return _fb.group({
    id: [block?.id ?? ''],
    deleted: [false],
    type: [block.type ?? StoryBlockTypes.EndStoryAnchorBlock],
    position: [block.position ?? { x: 50, y: 150 }],
    // Output options
    outputs : _fb.array(block?.outputs?.map((o, i) => _fb.group({ id: o.id, message: o.label, value: o.id })) ?? []),
  })
}