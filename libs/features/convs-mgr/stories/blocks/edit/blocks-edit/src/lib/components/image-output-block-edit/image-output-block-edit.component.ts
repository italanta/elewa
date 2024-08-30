import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image-output-block-edit',
  templateUrl: './image-output-block-edit.component.html',
  styleUrl: './image-output-block-edit.component.scss'
})
export class ImageOutputBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
  @Input() icon: string;
}
