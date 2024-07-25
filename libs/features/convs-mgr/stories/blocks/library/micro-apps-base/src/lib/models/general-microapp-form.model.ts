import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { MicroAppBlock } from "@app/model/convs-mgr/stories/blocks/messaging";


/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateGeneralMicroAppForm(_fb: FormBuilder, blockData: MicroAppBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    appName: [blockData?.appName ?? ''],
    appConfigs: [blockData?.configs ?? ''],
    message: [blockData?.message! ?? ''],
    type: [blockData.type ?? StoryBlockTypes.MicroAppBlock],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}
