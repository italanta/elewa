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

  viewRoles: string[] = [];

  panelState: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.roles)
      this.viewRoles = this.roles.map((role) => role.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }
}
