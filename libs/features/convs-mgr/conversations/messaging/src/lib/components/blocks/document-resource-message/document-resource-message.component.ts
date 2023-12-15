import { Component } from '@angular/core';

import { Message } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-document-resource-message',
  templateUrl: './document-resource-message.component.html',
  styleUrls: ['./document-resource-message.component.scss'],
})
export class DocumentResourceMessageComponent {
  getClasses(message: Message) {
    if (message.direction === 5 || message.direction === 25) {
      return ['message-content', 'grey'];
    } else {
      return ['message-content', 'green'];
    }
  }

  unPackFileSize(fileSize?: string) {
    if (!fileSize) return;

    return parseInt(fileSize) + ' kB';
  }

  downloadFile(fileSrc?: string) {
    if (!fileSrc) return;

    const newTab = window.open() as Window;
    newTab.location.href = fileSrc;
  }
}
