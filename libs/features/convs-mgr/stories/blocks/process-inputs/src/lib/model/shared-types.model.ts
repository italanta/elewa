import { FormBuilder, FormGroup } from '@angular/forms';

/** schema for the variable create function */
export type variableCreateFn = (
  fb: FormBuilder,
  fg: FormGroup,
  name: string
) => FormGroup;
