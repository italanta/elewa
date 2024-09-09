import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowPageLayoutElementTypesV31, FlowTextAreaInput, FlowTextInput } from "@app/model/convs-mgr/stories/flows";

@Injectable({ providedIn: "root" })
/**
 * Creates input forms and transforms the values to v31 inputs
 */
export class InputElementsFormService {
  constructor(private _formBuilder: FormBuilder) {}

  buildTextForm(textElement?: FlowTextInput | null ): FormGroup 
  {
    return this._formBuilder.group({
      name: [textElement?.name ?? "", Validators.required],
      label: [textElement?.label ?? "", Validators.required],
      required: [textElement?.required ?? "", Validators.required],
      type: [FlowPageLayoutElementTypesV31.TEXT_INPUT],
      inputType: [textElement?.["input-type"] ?? ''],
      minChars: [textElement?.["min-chars"]?? null, Validators.min(1)],
      maxChars: [textElement?.["max-chars"]?? null, Validators.max(255)],
      helperText: [textElement?.["helper-text"] ?? null, Validators.maxLength(80)],
      visible: [textElement?.visible ?? '']
    });
  }

  buildTextAreaForm(textElement?: FlowTextAreaInput): FormGroup {
    return this._formBuilder.group({
      name: [textElement?.name ?? "", Validators.required],
      label: [textElement?.label ?? "", Validators.required],
      required: [textElement?.required ?? "", Validators.required],
      visible: [textElement?.visible ?? ''],
      enabled: [textElement?.enabled ?? ''],
      type: FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT,
       "helper-text": [textElement?.["helper-text"] ?? null]
    })
  }

  buildEmptyTextAreaForm(): FormGroup {
    return this.buildTextAreaForm();
  }


  buildEmptyTextForm(): FormGroup {
    return this.buildTextForm();
  }

  // buildDateForm(textElement: FeTextInput): FormGroup {
  //   return this.buildForm(textElement, FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT);
  // }

  // buildEmptyDateForm(): FormGroup {
  //   return this.buildForm(null, FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT);
  // }

}

