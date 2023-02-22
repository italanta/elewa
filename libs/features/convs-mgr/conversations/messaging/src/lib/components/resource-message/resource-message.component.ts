import {Component, Input } from '@angular/core';
import { __NewDate, __DateFromStorage } from '@iote/time';

import { DomSanitizer } from '@angular/platform-browser';
import { FileMessage } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-resource-message',
  templateUrl: './resource-message.component.html',
  styleUrls:  ['./resource-message.component.scss'],
})
export class ResourceMessageComponent
{
  @Input() message: FileMessage;

  constructor(private _sanetizer: DomSanitizer) {}

  cleanUrl = (url: string | undefined) => this.message.url && this._sanetizer.bypassSecurityTrustResourceUrl(this._embedYoutube(this.message.url))

  // Checks if youtube url and adjusts embedding if that's the case.
  private _embedYoutube(url: string)
  {
    if(url.indexOf('watch?v=') > 0)
      url = url.replace('watch?v=', 'embed/');

    return url;
  }
}
