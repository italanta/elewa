import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-option-input-field',
  templateUrl: './option-input-field.component.html',
  styleUrls: ['./option-input-field.component.scss'],
})
export class OptionInputFieldComponent implements OnInit {

  @Input() blockFormGroup: FormGroup;
  @Input() formGroupNameInput: number | string;

  constructor() {}

  ngOnInit(): void {}
}
