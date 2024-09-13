import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowTextAreaInput } from "@app/model/convs-mgr/stories/flows";
import {FlowPageLayoutElementTypesV31} from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateFlowTextAreaInputForm(_fb: FormBuilder, blockData?: FlowTextAreaInput): FormGroup {
  return _fb.group({
    name: [blockData?.name ?? "", Validators.required],
      label: [blockData?.label ?? "", Validators.required],
      required: [blockData?.required ?? "", Validators.required],
      visible: [blockData?.visible ?? ''],
      enabled: [blockData?.enabled ?? ''],
      type: FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT,
      helperText: [blockData?.["helper-text"] ?? null]
  })
}