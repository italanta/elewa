import { Component } from '@angular/core';

@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent {
  cancel() {
    console.log('canceling');
  }
  save() {
    console.log('saving');
  }
}
