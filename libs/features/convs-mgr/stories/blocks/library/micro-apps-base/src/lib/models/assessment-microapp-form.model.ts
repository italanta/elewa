import { FormBuilder, FormGroup } from "@angular/forms";
import { MicroAppTypes } from "@app/model/convs-mgr/micro-app/base";

import { StoryBlockTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { AssessmentMicroAppBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateAssessmentBlockForm(_fb: FormBuilder, blockData: AssessmentMicroAppBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id ?? ''],
    message: [blockData?.message ?? ''],
    appId: [blockData?.appId ?? ''],
    name: [blockData?.name ?? ''],
    options: _fb.array([]),
    appType: MicroAppTypes.Assessment,
    storyId: [blockData?.storyId ?? ''],
    moduleId: [blockData?.moduleId ?? ''],
    botId: [blockData?.storyId ?? ''],
    defaultTarget: [blockData.defaultTarget ?? ''],
    type: [blockData.type ?? StoryBlockTypes.AssessmentMicroAppBlock],
    position: [blockData.position ?? { x: 200, y: 50 }]
  })
}
