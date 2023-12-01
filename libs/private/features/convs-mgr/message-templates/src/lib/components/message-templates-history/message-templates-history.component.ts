import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

import { SubSink } from 'subsink';
import { map, switchMap } from 'rxjs';

import { ScheduledMessage } from '@app/model/convs-mgr/functions';
import {
  MessageTemplatesService,
  ScheduleMessageService,
} from '@app/private/state/message-templates';

@Component({
  selector: 'app-message-templates-history',
  templateUrl: './message-templates-history.component.html',
  styleUrls: ['./message-templates-history.component.scss'],
})
export class MessageTemplatesHistoryComponent implements OnInit {
  displayedColumns: string[] = ['Date sent','Time sent','Number of learners','Status','Meta'];
  dataSource: MatTableDataSource<ScheduledMessage>;

  private _sBs = new SubSink();

  constructor(
    private templateMsgServ$: MessageTemplatesService,
    private scheduleMsgsServ$: ScheduleMessageService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._sBs.sink = this.getSheduledMessages$().subscribe((messages) => {
      this.dataSource = new MatTableDataSource(messages);
    });
  }

  /** get sheduled messages from the current template message selected */
  getSheduledMessages$() {
    return this._route.paramMap.pipe(
      switchMap((params) =>
        this.templateMsgServ$.getTemplateById(params.get('id') as string).pipe(
          switchMap((msgTemp) => {
            return this.scheduleMsgsServ$.getScheduledMessages$().pipe(
              map((schedMsgs) => {
                return schedMsgs.filter(
                  (scheduledMsg) => scheduledMsg.id === msgTemp?.id
                );
              })
            );
          })
        )
      )
    );
  }

  isTimePast(time: Date) {
    return time > new Date() ? 'Pending' : 'Sent';
  }
}
