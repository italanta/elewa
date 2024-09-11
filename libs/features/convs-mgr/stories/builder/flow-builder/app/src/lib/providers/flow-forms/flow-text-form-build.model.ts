import { FormBuilder, FormGroup } from "@angular/forms";

import { FlowPageTextV31 } from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateFlowTextForm(_fb: FormBuilder, blockData?: FlowPageTextV31): FormGroup {
  return _fb.group({
    text: [blockData?.text ?? ''],
    type: [blockData?.type ?? ''],
    size: [blockData?.size ?? '']
  })
}