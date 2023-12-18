import { Component, Input } from '@angular/core';
import { VideoMessage } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-video-resource-message',
  templateUrl: './video-resource-message.component.html',
  styleUrls: ['./video-resource-message.component.scss'],
})
export class VideoResourceMessageComponent {
  @Input() message: VideoMessage;

  getClasses(message: VideoMessage) {
    if (message.direction === 5 || message.direction === 25) {
      return ['message-content', 'grey'];
    } else {
      return ['message-content', 'green'];
    }
  }
}
