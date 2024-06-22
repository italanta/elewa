import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-validations',
  templateUrl: './phone-validations.component.html',
  styleUrls: ['./phone-validations.component.scss'],
})
export class PhoneValidationsComponent {
  @Input() validate: boolean;
  @Input() variablesForm: FormGroup;
}
