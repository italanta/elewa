import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-audio-input-block-edit',
  templateUrl: './audio-input-block-edit.component.html',
  styleUrls: ['./audio-input-block-edit.component.scss'],
})
export class AudioInputBlockEditComponent implements OnInit {
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
