import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, switchMap, take, tap } from 'rxjs';
import { SubSink } from 'subsink';

import { MessageTemplate, TemplateHeaderTypes, TextHeader } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';

import { createEmptyTemplateForm } from '../../providers/create-empty-message-template-form.provider';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent implements OnInit{
  @ViewChild('textAreaElement') textAreaElement: ElementRef;
  
  template$: Observable<MessageTemplate>;

  templateForm: FormGroup;
  template: MessageTemplate;
  content: FormGroup;

  action: string;
  panelOpenState = false;
  isSaving = false;


  channels: string[] = ['WhatsApp', 'Messenger'];
  categories: string[] = ['AUTHENTICATION', 'MARKETING', 'UTILITY'];
  languages: { display: string; value: string }[] = [
    { display: 'English', value: 'en' },
    { display: 'Spanish', value: 'es' },
    { display: 'Swahili', value: 'sw' }
  ];
  
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
    private _snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.action = this._route$$.url.split('/')[2];
    this.templateForm = createEmptyTemplateForm(this.fb);

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
    this.template$ = this._messageTemplatesService.getActiveTemplate$();

    this._sbS.sink = this.template$.subscribe((template) => {
      if (template) {
        this.templateForm = this.fb.group({
          name: [template.name, Validators.required],
          category: [template.category], 
          language: [template.language],
          content: this.fb.group({
            header: this.fb.group({
              type: "TEXT",
              text: [(template.content.header as TextHeader).text,  Validators.required],
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

    console.log(this.newVariables)


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
  save() {
    this.isSaving = true
    if (this.templateForm.value.id){
      console.log('updating',this.templateForm.value);
      this._messageTemplatesService.updateTemplate(this.templateForm.value).subscribe((response) => {
        this.isSaving  = false;
        console.log('Template sent to firebase', response);
      })
      
      this.template = {
        name: this.templateForm.value.name,
        category: this.templateForm.value.category,
        language: this.templateForm.value.language,
        content: {
          header: {
            type: TemplateHeaderTypes.TEXT,
            text: this.templateForm.value.content.header.text,
          },
          body: {
            text: this.templateForm.value.content.body.text,
            examples: this.newVariables,
          },
          footer: this.templateForm.value.content.footer,
        },
      };
      this._messageTemplatesService.updateTemplateMeta(this.template).subscribe((response) => {
        console.log('Template created:', response);
        if (response.success){
          this._messageTemplatesService.updateTemplate(this.templateForm.value).subscribe((response: any) => {
            this.isSaving  = false;
            console.log('Template sent to firebase', response);
          });
        }
      });
    }
    else{
      
      this.template = {
        "name": this.templateForm.value.name,
        "category": this.templateForm.value.category,
        "language": this.templateForm.value.language,
        "content": {
          "header": {
            "type": TemplateHeaderTypes.TEXT,
            "text": this.templateForm.value.content.header.text,
          },
          "body": {
            "text": this.templateForm.value.content.body.text,
            "examples": [],
          },
          "footer": this.templateForm.value.content.footer,
        },
      };
      if(this.templateForm.valid){
        this._messageTemplatesService.createTemplateMeta(this.template).subscribe((response) => {
          console.log('Template created:', response);
          if (response.success){
            this.templateForm.value.content.templateId = response.data.id;
            this._messageTemplatesService.addMessageTemplate(this.templateForm.value).subscribe((response: any) => {
              this.isSaving  = false;
              console.log('Template sent to firebase', response);
              this._snackbar.showSuccess("Template created successfully");
            });
          }
        });
      }else{
        this._snackbar.showError("Please fill out all fields");
      }
      
    }
    
    this.isSaving = false;

  }

  
}
