import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-resource-message',
  templateUrl: './image-resource-message.component.html',
  styleUrls: ['./image-resource-message.component.scss'],
})
export class ImageResourceMessageComponent {
  constructor(private _sanetizer: DomSanitizer) {}

  cleanUrl(url?: string) {
    return (url && this._sanetizer.bypassSecurityTrustResourceUrl(this._embedYoutube(url)));
  }

  private _embedYoutube(url: string) {
    if (url.indexOf('watch?v=') > 0) url = url.replace('watch?v=', 'embed/');

    return url;
  }
}
