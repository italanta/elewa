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
}
