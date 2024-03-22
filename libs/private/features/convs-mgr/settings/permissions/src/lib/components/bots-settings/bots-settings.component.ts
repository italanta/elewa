import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'clm-bots-settings',
  templateUrl: './bots-settings.component.html',
  styleUrls: ['./bots-settings.component.scss'],
})
export class BotsSettingsComponent {

  @Input() botsSettingsFormGroup: FormGroup;
  @Input() roles: string[];

  viewRoles: string[] = [];
  
  panelState: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.roles)
      this.viewRoles = this.roles.map((role) => role.replace(/([a-z])([A-Z])/g, '$1 $2'));
  }
}
