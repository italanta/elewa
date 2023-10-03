import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './message-template-list.component.html',
  styleUrls: ['./message-template-list.component.scss'],
})
export class MessageTemplateListComponent implements OnInit, OnDestroy{
  private _sBS = new SubSink();

  messageTemplates$: Observable<MessageTemplate[]>;

  dataFound = true;
  
  isSaving: boolean;
  messageTemplateColumns = ['name', 'sentMessages', 'lastUpdated', 'actions'];
  dataSource = new MatTableDataSource<MessageTemplate>();
  // @Input() assessments: MessageTemplate[];
  constructor(
    private _messageTemplates: MessageTemplatesService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.messageTemplates$ = this._messageTemplates.getMessageTemplates$();
    this._sBS.sink = this.messageTemplates$.subscribe((assessments)=> {
      this.dataSource.data = assessments;
      console.warn('here dey s', this.dataSource.data);
    })
  }

  onCreate() {
    throw new Error('Method not implemented.');
  }
  createTemplate() :void{
    this._router.navigate(['/messaging/create'])
  }
  openTemplate(templateId:string){
    this._router.navigate(['/messaging', templateId]);

  }
  ngOnDestroy(): void {
      this._sBS.unsubscribe();
  }
}
