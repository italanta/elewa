import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { StoryModuleBlock } from "@app/model/convs-mgr/stories/blocks/structural";

/**
 * 
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateStoryModuleBlockForm(_fb: FormBuilder, blockData: StoryModuleBlock): FormGroup 
{
  return _fb.group({
    id: [blockData?.id! ?? ''],
    title: [blockData?.blockTitle ?? ''],
    options : _fb.array(blockData?.outputs?.map((o, i) => _fb.group({ id: o.id, message: o.label, value: o.id })) ?? []),
    
    type: [blockData?.type ?? StoryBlockTypes.Structural],
    position: [blockData?.position ?? { x: 200, y: 50 }]
  })
}