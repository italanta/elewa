import {Component, OnInit, Input } from '@angular/core';
import { __NewDate, __DateFromStorage } from '@iote/time';

import { ButtonMessage }   from '@elewa/model/conversations/messages';

@Component({
  selector: 'elewa-button-message',
  templateUrl: './button-message.component.html',
  styleUrls:  ['./button-message.component.scss'],
})
export class ButtonMessageComponent implements OnInit
{
  @Input() message: ButtonMessage;

  ngOnInit() { }

}
