import {Component, Input } from '@angular/core';
import { __NewDate, __DateFromStorage } from '@iote/time';

import { ResourceMessage }   from '@elewa/model/conversations/messages';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'elewa-resource-message',
  templateUrl: './resource-message.component.html',
  styleUrls:  ['./resource-message.component.scss'],
})
export class ResourceMessageComponent
{
  @Input() message: ResourceMessage;

  constructor(private _sanetizer: DomSanitizer) {}

  cleanUrl = (url: string) => this._sanetizer.bypassSecurityTrustResourceUrl(this._embedYoutube(this.message.url))

  // Checks if youtube url and adjusts embedding if that's the case.
  private _embedYoutube(url: string)
  {
    if(url.indexOf('watch?v=') > 0)
      url = url.replace('watch?v=', 'embed/');

    return url;
  }
}
