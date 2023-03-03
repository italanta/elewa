import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-audio-input-block-edit',
  templateUrl: './audio-input-block-edit.component.html',
  styleUrls: ['./audio-input-block-edit.component.scss'],
})
export class AudioInputBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
}
