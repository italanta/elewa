import {Component, OnInit, Input } from '@angular/core';
import { __NewDate, __DateFromStorage } from '@iote/time';

import { QuestionMessage } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-button-message',
  templateUrl: './button-message.component.html',
  styleUrls:  ['./button-message.component.scss'],
})
export class ButtonMessageComponent implements OnInit
{
  @Input() message: QuestionMessage;

  @Input() timestamp: string;

  @Input()   messageIsNotMine: boolean;
  @Input()   agentMessage: boolean;


  ngOnInit() { }

}
