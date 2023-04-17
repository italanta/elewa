import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-email-block-edit',
  templateUrl: './email-block-edit.component.html',
  styleUrls: ['./email-block-edit.component.scss'],
})
export class EmailBlockEditComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() title: string;
  validate: boolean;

  ngOnInit() {
    this.validate = this.form.value.variable.validate;
}

  setValidation(){
    this.validate = !this.validate;
  }

}
