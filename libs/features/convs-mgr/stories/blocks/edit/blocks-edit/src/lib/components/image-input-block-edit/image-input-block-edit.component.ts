import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-input-block-edit',
  templateUrl: './image-input-block-edit.component.html',
  styleUrls: ['./image-input-block-edit.component.scss'],
})
export class ImageInputBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
}
