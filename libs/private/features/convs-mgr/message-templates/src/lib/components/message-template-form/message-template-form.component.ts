import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';

import { MessageTemplate, TemplateHeaderTypes, TextHeader } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { createEmptyTemplateForm } from '../../providers/create-empty-message-template-form.provider';
import { SnackbarService } from '../../services/snackbar.service';
import { categoryOptions, languageOptions } from '../../utils/constants';

@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent implements OnInit{
  @ViewChild('textAreaElement') textAreaElement: ElementRef;
  
  template$: Observable<any>;
  channels$: Observable<CommunicationChannel[]>;

  templateForm: FormGroup;
  template: MessageTemplate;
  content: FormGroup;

  action: string;
  panelOpenState: boolean;
  isSaving: boolean;


  categories: { display: string; value: string }[] = categoryOptions;
  languages: { display: string; value: string }[] = languageOptions;
  
  referenceForm: FormGroup;
  nextVariableId: number;
  newVariables: any = [];
  newVariableForm: FormGroup;
  private _sbS = new SubSink();

  constructor(
    private fb: FormBuilder,
    private _messageTemplatesService: MessageTemplatesService,
    private _route:ActivatedRoute,
    private _route$$: Router,
    private _snackbar: SnackbarService,
    private _channelService: CommunicationChannelService
  ) {}

  ngOnInit() {
    this.action = this._route$$.url.split('/')[2];
    this.templateForm = createEmptyTemplateForm(this.fb);
    this.channels$ = this._channelService.getAllChannels();

    if (this.action !== 'create') {
      this.initPage();
    } 

    this.newVariableForm = this.fb.group({
      newVariable: ['',Validators.required],
      newPlaceholder: ['',Validators.required],
    });
    // Subscribe to changes in the content.body control
    this.subscribeToBodyControlChanges();
    
  }

  initPage()
  {
    if (this.action){
      // TODO:Fetch template id from query params
      this.template$ = this._messageTemplatesService.getTemplateById(this.action.split('?')[0]) || '';

    }
    this._sbS.sink = this.template$.subscribe((template) => {
      if (template) {
        this.templateForm = this.fb.group({
          name: [template.name, Validators.required],
          channelId: [template.channelId, Validators.required],
          category: [template.category], 
          language: [template.language],
          content: this.fb.group({
            header: this.fb.group({
              type: "TEXT",
              text: [template.content.header.text,  Validators.required],
              examples: this.fb.array([]),
            }),
            body: this.fb.group({
              text: [template.content.body.text,  Validators.required],
              examples: this.fb.array([]),
            }),
            footer: [template.content.footer],
            templateId: [''],
            sent: [''],
          }),
          buttons: this.fb.array([]), 
        });
      }
    });
  }
  subscribeToBodyControlChanges() {
    const bodyControl = this.templateForm.get('content.body.text') as FormControl;
    bodyControl.valueChanges.subscribe((updatedBody) => {
      this.updateReferencesFromBody(updatedBody);
    });
  }

  addVariable() {
    // Get values from the newVariableForm
    const newVariable = this.newVariableForm.get('newVariable')?.value;
    const newPlaceholder = this.newVariableForm.get('newPlaceholder')?.value;

    // Surround the newVariable with {{}} and append it to the current content.body
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;
    const bodyControl = formBody.get('text') as FormControl;
    const updatedBody = `${bodyControl.value}{{${newPlaceholder}}}`;
    bodyControl.setValue(updatedBody);

    // Track new variables as strings
    this.newVariables.push({
      "variable": newVariable,
      "placeholder": newPlaceholder
      });

    // Clear the input fields in the newVariableForm
    this.newVariableForm.get('newVariable')?.reset();
    this.newVariableForm.get('newPlaceholder')?.reset();
  }

  removeVariable(index: number) {
    // Get the placeholder to be removed
    const placeholder = this.newVariables[index];

    // Remove the variable from the body
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;
    const bodyControl = formBody.get('text') as FormControl;
    let updatedText = bodyControl.value;
    const variableTag = `{{${placeholder}}}`;
    updatedText = updatedText.replace(new RegExp(variableTag, 'g'), '');

    bodyControl.setValue(updatedText);

    // Remove the placeholder from the newVariables array
    this.newVariables.splice(index, 1);
  }
  updateReferencesFromBody(updatedBody: string) {
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;

    const referencesArray = formBody.get('examples') as FormArray;

    // Iterate over the references and check if their placeholders exist in the updatedBody
    for (let i = referencesArray.length - 1; i >= 0; i--) {
      const referenceGroup = referencesArray.at(i) as FormGroup;
      const placeholder = referenceGroup.get('placeholder')?.value;
      
      // If the placeholder does not exist in the updated body, remove the reference
      if (!updatedBody.includes(`{{${placeholder}}}`)) {
        referencesArray.removeAt(i);
        // Also remove the associated new variable
        const variableIndex = this.newVariables.indexOf(placeholder);
        if (variableIndex !== -1) {
          this.newVariables.splice(variableIndex, 1);
        }
      }
    }
  }
    
  cancel() {
    this._route$$.navigate(['/messaging'])
  }

  openTemplate(){
    this._route$$.navigate(['/messaging']);

  }

  save() {
    if (this.templateForm.value.id){
      this.template = {
        id: this.templateForm.value.id,
        name: this.templateForm.value.name,
        category: this.templateForm.value.category,
        channelId: this.templateForm.value.channelId,
        language: this.templateForm.value.language,
        content: {
          header: {
            type: TemplateHeaderTypes.TEXT,
            text: this.templateForm.value.content.header.text,
          } as TextHeader,
          body: {
            text: this.templateForm.value.content.body.text,
            examples: this.newVariables,
          },
          footer: this.templateForm.value.content.footer,
        },
      };

      this.isSaving = true

      // TODO: clean this logic, create a better data stream
      this._sbS.sink = this._messageTemplatesService.updateTemplateMeta(this.template).subscribe((response) => {
        if (response.success){
          this._sbS.sink = this._messageTemplatesService.updateTemplate(this.templateForm.value).subscribe((response: any) => {
            this._snackbar.showSuccess("Template updated successfully");
            this.isSaving  = false;
          });
        }
      });
    }
    else{
      
      this.template = {
        "name": this.templateForm.value.name,
        "category": this.templateForm.value.category,
        "language": this.templateForm.value.language,
        "channelId": this.templateForm.value.channelId,
        "content": {
          "header": { 
            "type": TemplateHeaderTypes.TEXT,
            "text": this.templateForm.value.content.header.text,
          } as TextHeader,
          "body": {
            "text": this.templateForm.value.content.body.text,
            "examples": [],
          },
          "footer": this.templateForm.value.content.footer,
        },
      };
      if(this.templateForm.valid){
        this.isSaving = true
        this._sbS.sink = this._messageTemplatesService.createTemplateMeta(this.template).subscribe((response) => {
          if (response.success){
            this.templateForm.value.content.templateId = response.data.id;
      
            const templateId = `${this.templateForm.value.name}${this.templateForm.value.language}`

            this._sbS.sink = this._messageTemplatesService.addMessageTemplate(this.templateForm.value, templateId).subscribe((response: any) => {
              this.isSaving  = false;
              if(response.id) {
                this._snackbar.showSuccess("Template created successfully");
                this.openTemplate();
              }
              else{
                this._snackbar.showError("Something went wrong please try again")
              }
            });
          }
          else{
            this.isSaving = false;
            this._snackbar.showError(response)
          }
        });
      }else{
        this.isSaving = false;
        this._snackbar.showError("Please fill out all fields");
      }
      
    }
  }  
}