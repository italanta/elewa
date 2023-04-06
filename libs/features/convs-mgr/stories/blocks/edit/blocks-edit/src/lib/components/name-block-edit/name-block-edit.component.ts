import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-name-block-edit',
  templateUrl: './name-block-edit.component.html',
  styleUrls: ['./name-block-edit.component.scss'],
})
export class NameBlockEditComponent implements OnInit {
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
