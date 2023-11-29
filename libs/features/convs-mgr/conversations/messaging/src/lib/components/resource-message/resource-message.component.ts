import {Component, Input, OnInit } from '@angular/core';
import { __NewDate, __DateFromStorage } from '@iote/time';

import { DomSanitizer } from '@angular/platform-browser';
import { FileMessage, DocumentMessage } from '@app/model/convs-mgr/conversations/messages';
import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { ICONS_AND_TITLES } from 'libs/features/convs-mgr/stories/blocks/library/main/src/lib/assets/icons-and-titles';


@Component({
  selector: 'app-resource-message',
  templateUrl: './resource-message.component.html',
  styleUrls:  ['./resource-message.component.scss'],
})
export class ResourceMessageComponent implements OnInit
{
  @Input() message: FileMessage;
  @Input() documentMessage: DocumentMessage;
  @Input() block: DocumentMessageBlock;

  svgIcon = ''

  constructor(private _sanetizer: DomSanitizer) {}

  ngOnInit() {
    this.svgIcon = ICONS_AND_TITLES[7].svgIcon
  }

  cleanUrl = (url: string | undefined) => this.message.url && this._sanetizer.bypassSecurityTrustResourceUrl(this._embedYoutube(this.message.url))

  // Checks if youtube url and adjusts embedding if that's the case.
  private _embedYoutube(url: string)
  {
    if(url.indexOf('watch?v=') > 0)
      url = url.replace('watch?v=', 'embed/');

    return url;
  }

  // Getter function to retrieve the document URL
  get documentUrl(): string | undefined {
    return this.documentMessage?.url;
  }

  // Getter function to retrieve the document name
  get documentName(): string | undefined {
    return this.documentMessage?.documentName;
  }

  // Getter function to retrieve the file size
  get fileSize(): number | undefined {
    return this.block?.fileSize;
  }
}
