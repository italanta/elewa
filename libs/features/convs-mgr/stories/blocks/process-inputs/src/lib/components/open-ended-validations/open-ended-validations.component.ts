import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-open-ended-validations',
  templateUrl: './open-ended-validations.component.html',
  styleUrls: ['./open-ended-validations.component.scss'],
})
export class OpenEndedValidationsComponent {
  @Input() validate: boolean
  @Input() variablesForm: FormGroup;
}
