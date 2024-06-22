import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-location-validations',
  templateUrl: './location-validations.component.html',
  styleUrls: ['./location-validations.component.scss']
})
export class LocationValidationsComponent {

  @Input() validate: boolean
  @Input() variablesForm: FormGroup;

}
