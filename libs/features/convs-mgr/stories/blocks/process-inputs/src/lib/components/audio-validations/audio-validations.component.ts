import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-audio-validations',
  templateUrl: './audio-validations.component.html',
  styleUrls: ['./audio-validations.component.scss']
})

export class AudioValidationsComponent {
  @Input() validate: boolean
  @Input() variablesForm: FormGroup;

}
