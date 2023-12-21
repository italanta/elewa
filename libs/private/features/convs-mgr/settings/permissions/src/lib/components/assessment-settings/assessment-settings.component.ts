import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'clm-assessment-settings',
  templateUrl: './assessment-settings.component.html',
  styleUrls: ['./assessment-settings.component.scss']
})
export class AssessmentSettingsComponent implements OnInit {

  @Input() assessmentSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  viewRoles: string[] = [];

  panelState: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.roles)
      this.viewRoles = this.roles.map((role) => role.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }

}
