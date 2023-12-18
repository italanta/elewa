import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable, debounceTime, map } from 'rxjs';

import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ActiveOrgStore, OrganisationService } from '@app/private/state/organisation/main';
import { VariablesService } from '@app/features/convs-mgr/stories/blocks/process-inputs';
import { StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';
import { Bot } from '@app/model/convs-mgr/bots';

import { createTemplateForm } from '../../providers/create-empty-message-template-form.provider';
import { SnackbarService } from '../../services/snackbar.service';
import { categoryOptions, languageOptions } from '../../utils/constants';








@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent implements OnInit, OnDestroy {
  @ViewChild('textAreaElement') textAreaElement: ElementRef;

  template$: Observable<MessageTemplate | undefined>;
  channels$: Observable<CommunicationChannel[]>;

  templateForm: FormGroup;
  content: FormGroup;

  orgId:string;
  selectedVariable: string;
  showCard: boolean;
  selectedClass: string;
  botName:string;



  templateId: string;
  panelOpenState: boolean;
  isSaving: boolean;
  showVariablesSection :boolean;
  showSelectedVariableSection: boolean;

  categories: { display: string; value: string }[] = categoryOptions;
  languages: { display: string; value: string }[] = languageOptions;

  referenceForm: FormGroup;
  nextVariableId: number;
  newVariables: any = [];
  fetchedVariables: any = [];
  bots: Bot[] = [];
  selectedBot: Bot;
  newVariableForm: FormGroup;

  private _sbS = new SubSink();

  constructor(
    private fb: FormBuilder,
    private _messageTemplatesService: MessageTemplatesService,
    private _route: ActivatedRoute,
    private _route$$: Router,
    private _snackbar: SnackbarService,
    private _botStateServ$: BotsStateService,
    private _channelService: CommunicationChannelService, 
    private _variableService$ : VariablesService,
    private _activeOrgStore$$: ActiveOrgStore,
    private _orgService$$:OrganisationService
  ) {}

  ngOnInit() {
    this.templateForm = createTemplateForm(this.fb);
    this.initPage();
    this.showCard = true;
    this.channels$ = this._channelService.getAllChannels();
    this.newVariableForm = this.fb.group({
      newVariable: ['', Validators.required],
      newPlaceholder: ['', Validators.required],
    });
    this.newVariableForm.get('newPlaceholder')?.disable();
    // Subscribe to changes in the content.body control
    this.subscribeToBodyControlChanges();
    this.getActiveOrg();
    this.detectVariableChange()
  }

  initPage() {
    this._sbS.sink = this._route.params
      .pipe(map((params) => params['id'] as string))
      .subscribe((templateId) => {
        if (templateId) {
          this.template$ = this._messageTemplatesService.getTemplateById(templateId);

          this._sbS.sink = this.template$.subscribe((template) => {
            if (template) {
              this.templateForm = createTemplateForm(this.fb, template);
            }
          });
        }
      });
  }

  subscribeToBodyControlChanges() {
    const bodyControl = this.templateForm.get(
      'content.body.text'
    ) as FormControl;
    bodyControl.valueChanges.subscribe((updatedBody) => {
      this.updateReferencesFromBody(updatedBody);
    });
  }

  detectVariableChange() {
    this.newVariableForm.get('newVariable')?.valueChanges
      .pipe(debounceTime(2000)) // Debounce for 2000 milliseconds (2 seconds)
      .subscribe((value) => {
        // Check if the user is currently typing
        if (value !== '' && value !== null) {
          // This code will be executed after the user stops typing for 2 seconds
          this.addVariable();
        }
      });
  }

  addVariable() {
    // Get values from the newVariableForm
    const newVariable = this.newVariableForm.get('newVariable')?.value;
    const newPlaceholder = this.newVariableForm.get('newPlaceholder')?.value;
  
    // Determine whether to append to header or body based on user choice
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;
    const formHeader = formContent.get('header') as FormGroup;
    
    const bodyControl = formBody.get('text') as FormControl;
    const headerControl = formHeader.get('text') as FormControl;
  
    // Check the selectedClass variable to determine where to append the variable
    if (this.selectedClass === 'body') {
      const updatedBody = `${bodyControl.value}${newPlaceholder}`;
      bodyControl.setValue(updatedBody);
    } else if (this.selectedClass === 'header') {
      const updatedHeader = `${headerControl.value}${newPlaceholder}`;
      headerControl.setValue(updatedHeader);
    }
  
    // Track new variables as strings
    this.newVariables.push({
      variable: newVariable,
      placeholder: newPlaceholder,
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

  getActiveOrg() {
    this._activeOrgStore$$.get().subscribe((org) => {
      this.orgId = org.id ?? '';
    });
  }

  fetchBots(){
    this._botStateServ$.getBots().subscribe(data =>{
     this.bots = data
   })
 }

 onBotSelected(event: any , selectedClass: string) {
  this.showCard = true;
  this.selectedClass = selectedClass;
  this.selectedBot = event.value;
  // const selectedBotData = this.selectedBot;
  const selectedBotData = this.selectedBot as { id: string; name: string };

   // Now you can access both id and name
   const botId = selectedBotData.id;
   this.botName = selectedBotData.name;

  this._variableService$.getVariablesByBot(botId, this.orgId).subscribe(
    (data: StoryBlockVariable[]) => {
      this.fetchedVariables = data;
    }
  );
}


  cancel() {
    this._route$$.navigate(['/messaging']);
  }

  openTemplate() {
    this._route$$.navigate(['/messaging']);
  }

  save() {
    if (this.templateForm.value.id) {
      this.updateTemplate();
    } else {
      this.saveTemplate();
    }
  }

  updateTemplate() {
    this.isSaving = true;

    this._sbS.sink = this._messageTemplatesService
      .updateTemplateMeta(this.templateForm.value)
      .subscribe((response) => {
        if (response.success) {
          this._sbS.sink = this._messageTemplatesService
            .updateTemplate(this.templateForm.value)
            .subscribe(() => {
              this._snackbar.showSuccess('Template updated successfully');
              this.isSaving = false;
            });
        }
      });
  }

  updateVariableAndPlaceholder(variable: string) {
    // Updates the selected variable, hides the card, displays the variables section, and updates the new variable form placeholder.
    this.selectedVariable = variable;
    this.hideCard();
    this.showVariablesSection = true;
    this.newVariableForm.patchValue({ newPlaceholder: `{{${this.selectedVariable}}}` });
  }  
  
  hideCard() {
    this.showCard = false;
  }
  

  saveTemplate() {
    if (!this.templateForm.valid) {
      this._snackbar.showError('Please fill out all fields');
      return;
    }

    this.isSaving = true;
    this._sbS.sink = this._messageTemplatesService
      .createTemplateMeta(this.templateForm.value)
      .subscribe((response) => {
        if (!response.success) {
          this.isSaving = false;
          this._snackbar.showError(response);
        }

        this.templateForm.value.content.templateId = response.data.id;

        const templateId = `${this.templateForm.value.name}${this.templateForm.value.language}`;

        this._sbS.sink = this._messageTemplatesService
          .addMessageTemplate(this.templateForm.value, templateId)
          .subscribe(() => {
            this.isSaving = false;
            this._snackbar.showSuccess('Template created successfully');
            this.openTemplate();
          });
      });
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}
