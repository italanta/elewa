import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-block-edit',
  templateUrl: './phone-block-edit.component.html',
  styleUrls: ['./phone-block-edit.component.scss'],
})
export class PhoneBlockEditComponent implements OnInit {
  @Input() form: FormGroup

  ngOnInit(): void {
    console.log(this.form)
  }
}
