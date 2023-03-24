import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-name-validations',
  templateUrl: './name-validations.component.html',
  styleUrls: ['./name-validations.component.scss'],
})
export class NameValidationsComponent {
  @Input() formGroup: FormGroup;
  @Input() validate: boolean;
  @Input() formGroupName: string;
}
