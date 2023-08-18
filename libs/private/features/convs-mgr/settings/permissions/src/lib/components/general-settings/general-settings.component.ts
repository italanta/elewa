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
  
  constructor() { }

  ngOnInit(): void {
  }

}
