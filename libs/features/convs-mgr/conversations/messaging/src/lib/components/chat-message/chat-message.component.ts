import {Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Message, MessageDirection, TextMessage, DocumentMessage } from '@app/model/convs-mgr/conversations/messages';
import { DocumentMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { ICONS_AND_TITLES } from '../../../../../../stories/blocks/library/main/src/lib/assets/icons-and-titles'; 

import { __NewDate, __DateFromStorage } from '@iote/time';

// import { ChatMessage, MessageOrigins, TextMessage }   from '@elewa/model/conversations/messages';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls:  ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements OnInit, AfterViewInit
{
  @Input() message: Message;
  @Input() documentMessage: DocumentMessage;
  @Input() block: DocumentMessageBlock;

  // Calculated properties
  messageIsNotMine: boolean;
  
  agentMessage: boolean;
  timestamp: string;

  svgIcon = ''

  constructor(private _sanetizer: DomSanitizer, private http: HttpClient) {}

  ngOnInit() {
    this.svgIcon = ICONS_AND_TITLES[7].svgIcon
  }

  ngAfterViewInit(): void {
    if (this.message) {
      this.messageIsNotMine = this.message.direction === MessageDirection.FROM_ENDUSER_TO_AGENT || this.message.direction === MessageDirection.FROM_END_USER_TO_CHATBOT;
      this.agentMessage = this.message.direction === MessageDirection.FROM_AGENT_TO_END_USER  || this.message.direction === MessageDirection.FROM_CHATBOT_TO_END_USER;
      this.timestamp = __DateFromStorage(this.message.createdOn as Date).format('DD/MM HH:mm');
    }
  }

  textMessage(message: Message)
  {
    const html = this._convertText((message as TextMessage).text);
    return this._sanetizer.bypassSecurityTrustHtml(html);
  }

  private _convertText(message: string)
  {
    if(message) {
      message = this._replaceTags(message, '*', '<b>', '</b>');
      message = this._replaceTags(message, '_', '<i>', '</i>');
    }
    return message;
  }

  // Replaces md with html e.g. *text* => <b>text</b>
  private _replaceTags(message: string, tagEl: string, openTag: string, closeTag: string)
  {
    let inTag = false;
    while(message.indexOf(tagEl) >= 0)
    {
      message = this._replaceAt(message, message.indexOf(tagEl), inTag ? closeTag : openTag);
      inTag = !inTag;
    }

    return message;
  }

  private _replaceAt(msg : string, index : number, replacement: string) {
    return msg.substr(0, index) + replacement + msg.substr(index + 1);
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

  downloadDocument() {
    const documentUrl: string | undefined = this.documentUrl;

    if (documentUrl) {
      // Use HttpClient to fetch the document as a blob
      this.http.get(documentUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
        // Create a Blob URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement('a');
        // Set the href attribute to the Blob URL
        link.href = blobUrl;
        // Set the download attribute to the document name
        link.download = this.documentName || 'document';
        // Append the link to the document
        document.body.appendChild(link);
        // Simulate a click on the link to trigger the download
        link.click();
        // Remove the link from the document
        document.body.removeChild(link);
        // Revoke the Blob URL to free up resources
        window.URL.revokeObjectURL(blobUrl);
      });
    }
  }
}
