import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-location-input-block-edit',
  templateUrl: './location-input-block-edit.component.html',
  styleUrls: ['./location-input-block-edit.component.scss'],
})
export class LocationInputBlockEditComponent implements OnInit{
  @Input() form: FormGroup;
  @Input() title: string;
  validate: boolean;

  ngOnInit() {
    this.validate = this.form.value.variable.validate;
  }

  setValidation() {
    this.validate = !this.validate;
  }
}
