import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-video-input-block-edit',
  templateUrl: './video-input-block-edit.component.html',
  styleUrls: ['./video-input-block-edit.component.scss'],
})
export class VideoInputBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
}
