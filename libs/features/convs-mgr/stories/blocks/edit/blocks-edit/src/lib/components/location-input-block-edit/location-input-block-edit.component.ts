import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-location-input-block-edit',
  templateUrl: './location-input-block-edit.component.html',
  styleUrls: ['./location-input-block-edit.component.scss'],
})
export class LocationInputBlockEditComponent {
  @Input() form: FormGroup;
  @Input() title: string;
}
