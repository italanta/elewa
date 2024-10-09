import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowDatePickerInput } from "@app/model/convs-mgr/stories/flows";
import {FlowPageLayoutElementTypesV31} from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateFlowDatePickerInputForm(_fb: FormBuilder, blockData?: FlowDatePickerInput): FormGroup 
{
  return _fb.group({
    name: [blockData?.name ?? "", Validators.required],
    label: [blockData?.label ?? "", Validators.required],
    required: [blockData?.required ?? "", Validators.required],
    helperText: [blockData?.["helper-text"] ?? null],
    type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT});
}
