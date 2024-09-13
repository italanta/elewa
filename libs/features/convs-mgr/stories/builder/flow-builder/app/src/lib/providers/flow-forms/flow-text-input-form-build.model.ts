import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowDatePickerInput } from "@app/model/convs-mgr/stories/flows";
import {FlowPageLayoutElementTypesV31} from "@app/model/convs-mgr/stories/flows";

/**
 * 
 * @param _fb instance of formbuilder that creates formgroups controls etc
 * @param blockData the data being patched into the FormGroup
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateFlowTextInputForm(_fb: FormBuilder, blockData?: FlowDatePickerInput): FormGroup 
{
  return _fb.group({
    name: [blockData?.name ?? "", Validators.required],
      label: [blockData?.label ?? "", Validators.required],
      required: [blockData?.required ?? "", Validators.required],
      type: [FlowPageLayoutElementTypesV31.TEXT_INPUT],
      inputType: [blockData?.["input-type"] ?? ''],
      minChars: [blockData?.["min-chars"]?? null, Validators.min(1)],
      maxChars: [blockData?.["max-chars"]?? null, Validators.max(255)],
      helperText: [blockData?.["helper-text"] ?? null, Validators.maxLength(80)],
      visible: [blockData?.visible ?? '']
  });
}