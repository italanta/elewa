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
    private _messageTemplateService: MessageTemplatesService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.messageTemplates$ = this._messageTemplateService.getMessageTemplates$();
    this.templateStatus$ = this._messageTemplateService.getTemplateStatus();
    // this._sBS.sink = combineLatest([this.messageTemplates$, this.templateStatus$]).pipe(
    //   map(([templates, statusData]) => {
    //     // Merge templates with status based on a common identifier (e.g., name)
    //     return templates.map((template) => ({
    //       ...template,
    //       status: statusData.find((status) => status.name === template.name)?.status || 'N/A'
    //     }));
    //   })
    // ).subscribe((mergedData) => {
    //   this.dataSource.data = mergedData;
    // });
    this._sBS.sink = this.messageTemplates$.subscribe((assessments)=> {
      this.dataSource.data = assessments;
      console.warn('here dey s', this.dataSource.data);
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
    this._messageTemplateService.addMessageTemplate(duplicatedTemplate).subscribe(
      (response) => console.log(response)
    )
  }
  deleteTemplate(template: MessageTemplate){
    this._messageTemplateService.removeTemplate(template);
  }
  ngOnDestroy(): void {
      this._sBS.unsubscribe();
  }
}
