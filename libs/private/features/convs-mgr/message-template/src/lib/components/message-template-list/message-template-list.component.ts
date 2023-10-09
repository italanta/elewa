import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MessageTemplate, TemplateHeaderTypes, TextHeader } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService, MessageStatusRes, MessageTemplateStore, ActiveMessageTemplateStore } from '@app/private/state/message-templates';
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

  template:MessageTemplate;

  dataFound = true;
  
  isSaving: boolean;
  messageTemplateColumns = ['name', 'sentMessages', 'lastUpdated', 'actions'];
  dataSource = new MatTableDataSource<any>();
  searchForm: FormGroup;

  
  constructor(
    private _messageTemplateService: MessageTemplatesService,
    private fb: FormBuilder,
    private _router: Router,
  ) {
    this.searchForm = this.fb.group({
      searchInput: [''], 
    });
  }


  ngOnInit(): void {
    this.isSaving = true;
    this.messageTemplates$ = this._messageTemplateService.getMessageTemplates$();
    this.templateStatus$ = this._messageTemplateService.getTemplateStatus();
    this._sBS.sink = combineLatest([this.messageTemplates$, this.templateStatus$]).pipe(
      map(([templates, statusData]) => {
        // Merge templates with status based on a common identifier (e.g., name)
        return templates.map((template) => ({
          ...template,
          status: statusData['templates'].find((status: any) => status.name === template.name)?.status || 'N/A'
        }));
      })
    ).subscribe((mergedData) => {
      this.dataSource.data = mergedData;
      this.isSaving = false;
    });
    // this._sBS.sink = this.templateStatus$.subscribe((assessments)=> {
    //   this.dataSource.data = assessments;
    //   console.warn('here dey s', assessments);
    // });

    this.searchForm.get('searchInput')?.valueChanges.subscribe((searchText) => {
      this.applyFilter(searchText);
    });
    
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
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

  sendButtonClicked(template: MessageTemplate){
    this._router.navigate(['/learners'], {queryParams: {templateId: template.id}});
  }

  duplicateTemplate(template: MessageTemplate){
    // const duplicatedTemplate: MessageTemplate = {...template};

    // reset the template stats
    this.template = {
      "name": `${template.name}_copy`,
      "category": template.category,
      "language": template.language,
      "content": {
        "header": {
          "type": TemplateHeaderTypes.TEXT,
          "text": (template.content.header as TextHeader).text,
        },
        "body": {
          "text": template.content.body.text,
          "examples": [],
        },
        "footer": template.content.footer,
      },
    };
    this._messageTemplateService.createTemplateMeta(this.template).subscribe(
      (response) => {
        if( response.success){
          this._messageTemplateService.addMessageTemplate(this.template).subscribe(
            (response) => console.log(response)
          );
        }
      }
    )
    
  }
  deleteTemplate(template: MessageTemplate){
    this._messageTemplateService.deleteTemplateMeta(template).subscribe(
      (response) => {
        if(response.success){
          console.log("deleting both");
          this._messageTemplateService.removeTemplate(template);
        }
      }
    )
    
  }
  ngOnDestroy(): void {
      this._sBS.unsubscribe();
  }
}
