import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-email-validations',
  templateUrl: './email-validations.component.html',
  styleUrls: ['./email-validations.component.scss'],
})
export class EmailValidationsComponent {
  @Input() validate: boolean;
  @Input() variablesForm: FormGroup;
}
