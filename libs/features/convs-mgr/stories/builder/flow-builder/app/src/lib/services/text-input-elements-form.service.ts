import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FlowDatePickerInput, FlowPageLayoutElementTypesV31, FlowTextAreaInput, FlowTextInput } from "@app/model/convs-mgr/stories/flows";

@Injectable({ providedIn: "root" })
/**
 * Creates input forms and transforms the values to v31 inputs
 */
export class InputElementsFormService {
  constructor(private _formBuilder: FormBuilder) {}

  /**
   * 
   * @param textElement FlowTextInput element, Meta Compatible
   * @returns A form group for use with text inputs eg email, phone number etc
   */
  buildTextForm(textElement?: FlowTextInput): FormGroup 
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

  /**
   * 
   * @param textElement FlowTextAreaInput element, Meta Compatible
   * @returns  A form group for use with long text inputs if element is available
   */
  buildTextAreaForm(textElement?: FlowTextAreaInput): FormGroup {
    return this._formBuilder.group({
      name: [textElement?.name ?? "", Validators.required],
      label: [textElement?.label ?? "", Validators.required],
      required: [textElement?.required ?? "", Validators.required],
      visible: [textElement?.visible ?? ''],
      enabled: [textElement?.enabled ?? ''],
      type: FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT,
      helperText: [textElement?.["helper-text"] ?? null]
    })
  }

  /**
   * 
   * @param textElement FlowDatePicker element, Meta Compatible
   * @returns A form group for use with date inputs when element is present
   */
  buildDateForm(textElement?: FlowDatePickerInput): FormGroup {
    return this._formBuilder.group({
      name: [textElement?.name ?? "", Validators.required],
      label: [textElement?.label ?? "", Validators.required],
      required: [textElement?.required ?? "", Validators.required],
      helperText: [textElement?.["helper-text"] ?? null],
      type: FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT});
  }

  // SECTION: EMPTY FORMS

  /**
   * 
   * @returns A form group for use with date inputs
   */
  buildEmptyDateForm(): FormGroup {
    return this.buildDateForm();
  }

  /**
   * 
   * @returns A form group for use with long text inputs
   */
  buildEmptyTextAreaForm(): FormGroup {
    return this.buildTextAreaForm();
  }

  /**
   * 
   * @returns A form group for use with single line text inputs
   */
  buildEmptyTextForm(): FormGroup {
    return this.buildTextForm();
  }
}

