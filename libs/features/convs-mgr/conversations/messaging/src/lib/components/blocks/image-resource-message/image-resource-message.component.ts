import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileMessage } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-image-resource-message',
  templateUrl: './image-resource-message.component.html',
  styleUrls: ['./image-resource-message.component.scss'],
})
export class ImageResourceMessageComponent {
  @Input() message: FileMessage;

  constructor(private _sanetizer: DomSanitizer) {}

  cleanUrl(url?: string) {
    return (url && this._sanetizer.bypassSecurityTrustResourceUrl(this._embedYoutube(url)));
  }

  private _embedYoutube(url: string) {
    if (url.indexOf('watch?v=') > 0) url = url.replace('watch?v=', 'embed/');

    return url;
  }
}
