import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'clm-learners-settings',
  templateUrl: './learner-settings.component.html',
  styleUrls: ['./learner-settings.component.scss'],
})
export class LearnerSettingsComponent {
  @Input() learnerSettingsFormGroup: FormGroup;
  @Input() roles: string[];
}
