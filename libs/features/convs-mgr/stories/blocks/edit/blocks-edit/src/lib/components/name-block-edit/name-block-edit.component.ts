import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-name-block-edit',
  templateUrl: './name-block-edit.component.html',
  styleUrls: ['./name-block-edit.component.scss'],
})
export class NameBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
}
