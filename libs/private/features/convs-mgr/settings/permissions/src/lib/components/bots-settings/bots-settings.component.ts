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
}
