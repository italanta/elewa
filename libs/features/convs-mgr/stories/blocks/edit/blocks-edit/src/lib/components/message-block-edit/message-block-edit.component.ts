import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-message-block-edit',
  templateUrl: './message-block-edit.component.html',
  styleUrls: ['./message-block-edit.component.scss'],
})
export class MessageBlockEditComponent {
  @Input() form: FormGroup;
}
