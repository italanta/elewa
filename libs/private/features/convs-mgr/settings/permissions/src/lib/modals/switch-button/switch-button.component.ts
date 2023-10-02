import {  Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { tap } from 'rxjs';

@Component({
  selector: 'app-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.scss'],
})
export class SwitchButtonComponent {
  @Input() generalSettingsFormGroup: FormGroup;
  @Input() formGroupNameGeneralValue: string;
  @Input() formGroupNameValue: string;
  @Input() formControlNameValue: string;

  isFormActive = false;


}