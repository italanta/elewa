import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/**
 * @param _fb instance of formbuilder that creates the NameBlock's formgroups controls etc
 * @param form the formGroup that belongs to selected block.
 * @param variable the default variable name to set if block is fresh (no variable has been set).
 * @returns builds the formgroup with data if available and returns the Formgroup
 */
export function _CreateNameBlockVariableForm(
  _fb: FormBuilder,
  form: FormGroup,
  variable: string
): FormGroup {
  return _fb.group({
    name: [form.value.variable.name || variable, [Validators.required]],
    type: [form.value.variable.type || 1, [Validators.required]],
    validators: _fb.group({
      regex: [form.value.variable.validators.regex],
      max: [form.value.variable.validators.max],
      min: [form.value.variable.validators.min],
      validationMessage: [
        form.value.variable.validators.validationMessage ||
          "I'm afraid I didn't understand, could you try again, please?",
      ],
    }),
  });
}
