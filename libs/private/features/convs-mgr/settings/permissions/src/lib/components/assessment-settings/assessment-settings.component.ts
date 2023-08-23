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

  constructor() { }

  ngOnInit(): void {
  }

}
