import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplateStore, MessageTemplatesService, MessageStatusRes } from '@app/private/state/message-templates';
import { Observable, combineLatest, map } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './message-template-list.component.html',
  styleUrls: ['./message-template-list.component.scss'],
})
export class MessageTemplateListComponent implements OnInit, OnDestroy{
  private _sBS = new SubSink();

  messageTemplates$: Observable<MessageTemplate[]>;
  templateStatus$: Observable<MessageStatusRes[]>;

  dataFound = true;
  
  isSaving: boolean;
  messageTemplateColumns = ['name', 'sentMessages', 'lastUpdated', 'actions'];
  dataSource = new MatTableDataSource<any>();
  // @Input() assessments: MessageTemplate[];
  constructor(
    private _messageTemplates: MessageTemplatesService,
    private messageTemplateStore: MessageTemplateStore,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.messageTemplates$ = this._messageTemplates.getMessageTemplates$();
    this.templateStatus$ = this._messageTemplates.getTemplateStatus();
    this._sBS.sink = combineLatest([this.messageTemplates$, this.templateStatus$]).pipe(
      map(([templates, statusData]) => {
        // Merge templates with status based on a common identifier (e.g., name)
        return templates.map((template) => ({
          ...template,
          status: statusData.find((status) => status.name === template.name)?.status || 'N/A'
        }));
      })
    ).subscribe((mergedData) => {
      this.dataSource.data = mergedData;
    });
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
  duplicateTemplate(template: MessageTemplate){
    const duplicatedTemplate: MessageTemplate = {...template};
    duplicatedTemplate.name += ' Copy';

    // reset the template stats
    duplicatedTemplate.id = '';
    duplicatedTemplate.templateId = '';
    duplicatedTemplate.sent = 0;
    this.messageTemplateStore.createMessageTemplate(duplicatedTemplate).subscribe(
      (response) => console.log(response)
    )
  }
  deleteTemplate(template: MessageTemplate){
    this.messageTemplateStore.deleteMessageTemplate(template);
  }
  ngOnDestroy(): void {
      this._sBS.unsubscribe();
  }
}
