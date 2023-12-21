import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'clm-analytics-settings',
  templateUrl: './analytics-settings.component.html',
  styleUrls: ['./analytics-settings.component.scss'],
})
export class AnalyticsSettingsComponent {
  @Input() analyticsSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  viewRoles: string[] = [];

  panelState: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.roles)
      this.viewRoles = this.roles.map((role) => role.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }
}
