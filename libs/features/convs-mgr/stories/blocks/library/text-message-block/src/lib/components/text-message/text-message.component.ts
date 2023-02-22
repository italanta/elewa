import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.scss']
})
export class TextMessageComponent {
  @Input() controlName: string;
  @Input() label: string;
  @Input() control: FormControl;
  @Input() rows = 1;

}
