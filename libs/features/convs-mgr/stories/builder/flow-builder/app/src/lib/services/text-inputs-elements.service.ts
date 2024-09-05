import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FeTextInput } from "../models/text-type-elements.model";
import { FlowPageLayoutElementTypesV31, FlowTextInput, FlowTextInputTypes } from "@app/model/convs-mgr/stories/flows";

@Injectable({ providedIn: "root" })
/**
 * Creates input forms and transforms the values to v31 inputs
 */
export class TextInputElementsService {
  constructor(private _formBuilder: FormBuilder) {}

  private buildForm(
    textElement: FeTextInput | null,
    type: FlowPageLayoutElementTypesV31
  ): FormGroup {
    return this._formBuilder.group({
      name: [textElement?.name ?? "", Validators.required],
      label: [textElement?.label ?? "", Validators.required],
      required: [textElement?.required ?? "", Validators.required],
      type: [textElement?.type ?? type, Validators.required],
      inputType: [textElement?.inputType ?? ''],
      minChars: [textElement?.minChars ?? null, Validators.min(1)],
      maxChars: [textElement?.maxChars ?? null, Validators.max(255)],
      helperText: [textElement?.helperText ?? '', Validators.maxLength(80)],
      visible: [textElement?.disabled ?? '']
    });
  }

  buildTextAreaForm(textElement: FeTextInput): FormGroup {
    return this.buildForm(textElement, FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT);
  }

  buildEmptyTextAreaForm(): FormGroup {
    return this.buildForm(null, FlowPageLayoutElementTypesV31.TEXT_AREA_INPUT);
  }

  buildTextForm(textElement: FeTextInput): FormGroup {
    return this.buildForm(textElement, FlowPageLayoutElementTypesV31.TEXT_INPUT);
  }

  buildEmptyTextForm(): FormGroup {
    return this.buildForm(null, FlowPageLayoutElementTypesV31.TEXT_INPUT);
  }

  buildDateForm(textElement: FeTextInput): FormGroup {
    return this.buildForm(textElement, FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT);
  }

  buildEmptyDateForm(): FormGroup {
    return this.buildForm(null, FlowPageLayoutElementTypesV31.DATE_PICKER_INPUT);
  }

}
/** Utility to transform FeTextInput to FlowTextInput */
export function __transformToFlowTextInput(textElement: FeTextInput): FlowTextInput {
  return {
    name: textElement.name,
    "input-type": textElement.inputType as FlowTextInputTypes,  // Cast to specific input type enum if necessary
    label: textElement.label,
    required: textElement.required,
    "helper-text": textElement.helperText ?? '',  
    "min-chars": textElement.minChars ?? undefined,  
    "max-chars": textElement.maxChars ?? undefined, 
    visible: textElement.disabled ?? undefined,
    type: FlowPageLayoutElementTypesV31.TEXT_INPUT,
  };
}