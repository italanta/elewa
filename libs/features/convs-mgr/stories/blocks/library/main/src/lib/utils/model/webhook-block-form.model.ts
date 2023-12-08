
import { FormBuilder, FormGroup } from "@angular/forms";

import { StoryBlockTypes, HttpMethodTypes } from "@app/model/convs-mgr/stories/blocks/main";
// import { HttpMethodTypes } from "@app/model/convs-mgr/stories/blocks/main";
import { WebhookBlock } from "@app/model/convs-mgr/stories/blocks/messaging";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateWebhookBlockForm(_fb: FormBuilder, blockData: WebhookBlock): FormGroup {
  return _fb.group({
    id: [blockData?.id! ?? ''],
    httpUrl: [blockData.httpUrl ?? ''],
    variablesToPost: [blockData?.variablesToPost! ?? []],
    variablesToSave: [blockData?.variablesToSave! ?? []],
    type: [blockData.type ?? StoryBlockTypes.WebhookBlock],
    position: [blockData.position ?? { x: 200, y: 50 }],

    httpMethod: [blockData?.httpMethod! ?? HttpMethodTypes.POST],
    defaultTarget: [blockData.defaultTarget ?? ''],  
  })
}