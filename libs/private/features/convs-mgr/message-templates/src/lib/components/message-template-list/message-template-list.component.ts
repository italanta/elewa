import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Observable, combineLatest, concatMap, forkJoin, map, mergeMap, of, switchMap, toArray } from 'rxjs';

import { ScheduledMessage } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService, MessageStatusRes, ScheduleMessageService } from '@app/private/state/message-templates';

import { SnackbarService } from '../../services/snackbar.service';
import { TemplateHeaderTypes, TemplateMessage, TextHeader } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-message-template-list',
  templateUrl: './message-template-list.component.html',
  styleUrls: ['./message-template-list.component.scss'],
})
export class MessageTemplateListComponent implements OnInit, OnDestroy {
  private _sBS = new SubSink();

  messageTemplates$: Observable<TemplateMessage[]>;
  templateStatus$: Observable<MessageStatusRes>;
  scheduledMessages$: Observable<ScheduledMessage[]>;

  template:TemplateMessage;

  dataFound = true;
  
  isSaving: boolean;
  messageTemplateColumns = ['name', 'sentMessages', 'lastUpdated','status', 'send', 'actions'];
  dataSource = new MatTableDataSource<any>();
  searchForm: FormGroup;

  constructor(
    private _messageTemplateService: MessageTemplatesService,
    private fb: FormBuilder,
    private _router: Router,
    private _scheduleMessageService: ScheduleMessageService,
    private _snackBar: SnackbarService
  ) {
    this.searchForm = this.fb.group({
      searchInput: [''],
    });
  }

  ngOnInit(): void {
    this.getTemplates();

    this._sBS.sink = this.searchForm.get('searchInput')?.valueChanges.subscribe((searchText) => {
      this.applyFilter(searchText);
    });
  }

  getTemplates() {
    this.isSaving = true;

    this._sBS.sink = this._messageTemplateService.getMessageTemplates$().pipe(switchMap((templates)=> {

      const updatedTemplates$ = templates.map((temp)=> {
         return this._scheduleMessageService.getScheduleByTemplate$(temp.id as string).pipe(
          map((sch)=> {
          if(sch) (temp as any).messageCount = sch.successful?.length;
          
          return temp;
         }),
        )
      })

      return combineLatest(updatedTemplates$)
    })).subscribe((templates)=> {
        this.isSaving = false;
        this.dataSource.data = templates
        this.getTemplateStatus(templates);
    })

  }

  getTemplateStatus(templates: TemplateMessage[]) {
    const firstTemplate = templates[0];

    if (!templates || templates.length === 0 || !firstTemplate.channelId) {
      return;
    }

    const channelId = firstTemplate ? firstTemplate.channelId : '';

    this.templateStatus$ = this._messageTemplateService.getTemplateStatus(channelId);

    this._sBS.sink = combineLatest([of(templates), this.templateStatus$])
      .pipe(
        map(([templates, statusData]) => 
        {
          // @Reagan, please clarify the 'templates' vall
          const mergedData = templates.map((template) => {
            const status = (statusData['templates'].find((status: any) => template.name === status.name) || {}).status || 'N/A';
            return {...template, status};
          });
          return mergedData;
        })
      )
      .subscribe((mergedData) => this.dataSource.data = mergedData);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  createTemplate() :void{
    this._router.navigate(['/messaging/create'])
  }

  openTemplate(templateId:string){
    this._router.navigate(['/messaging', templateId], { queryParams: { selectedTab: 3 }});
  }

  sendButtonClicked(template: TemplateMessage){
    this._router.navigate(['/users'], {queryParams: {templateId: template.id}});
  }

  duplicateTemplate(template: TemplateMessage){

    // reset the template stats
    const header: TextHeader = {
      "type": TemplateHeaderTypes.TEXT,
      "text": (template.content?.header as TextHeader).text,
    }
    this.template = {
      "name": `${template.name}_copy`,
      "category": template.category,
      "type": template.type,
      "templateType": template.templateType,
      "language": template.language,
      "channelId": template.channelId,
      "content": {
        "header": header,
        "body": {
          "text": template.content?.body.text as string,
          "examples": [],
        },
        "footer": template.content?.footer,
      },
    };
    this.isSaving = true;
    this._sBS.sink = this._messageTemplateService.createTemplateMeta(this.template).subscribe(
      (response) => {
        if( response.success){
          this._sBS.sink = this._messageTemplateService.addMessageTemplate(this.template).subscribe(
            response => {
              if(response.id){
                this.isSaving=false;
                this._snackBar.showSuccess("Template duplicated successfully");
              } 
              else {
                this.isSaving=false;
                this._snackBar.showError("Something went wrong please try again");
              } 
            }
          );
        }
        else{
          this.isSaving=false;
          this._snackBar.showError("Something went wrong please try again");
        }
      }
    )
    
  }
  deleteTemplate(template: TemplateMessage){
    this.isSaving = true;
    this._sBS.sink =this._messageTemplateService.deleteTemplateMeta(template).subscribe(
      (response) => {
        if(response.success){
          this._sBS.sink = this._messageTemplateService.removeTemplate(template).subscribe(
            (response) =>{
              this._snackBar.showSuccess("Successfully deleted")
              this.isSaving = false;
            },
            (error) => {
              this._snackBar.showError(error);
            }
          );
        }
      }
    )
    
  }

  modifyStatus(status: string) {
    if(!status) return;
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  }

  ngOnDestroy(): void {
      this._sBS.unsubscribe();
  }
}
