import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'clm-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  @Input() generalSettingsFormGroup: FormGroup;
  @Input() roles: string[];
  
  viewRoles: string[] = [];

  panelState: boolean =  false;

  constructor() {}

  ngOnInit(): void {
    if (this.roles)
      this.viewRoles = this.roles.map((role) => role.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }
}
