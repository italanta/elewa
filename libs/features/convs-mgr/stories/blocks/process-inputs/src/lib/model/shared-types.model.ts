import { FormBuilder, FormGroup } from '@angular/forms';

export type variableCreateFn = (
  fb: FormBuilder,
  fg: FormGroup,
  name: string
) => FormGroup;
