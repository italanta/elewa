import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-email-block-edit',
  templateUrl: './email-block-edit.component.html',
  styleUrls: ['./email-block-edit.component.scss'],
})
export class EmailBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
}
