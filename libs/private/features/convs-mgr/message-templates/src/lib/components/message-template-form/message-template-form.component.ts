import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable, debounceTime, distinctUntilChanged, map } from 'rxjs';

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
  showHeaderSection :boolean;
  showSelectedVariableSection: boolean;

  categories: { display: string; value: string }[] = categoryOptions;
  languages: { display: string; value: string }[] = languageOptions;

  referenceForm: FormGroup;
  nextVariableId: number;
  userAddedVariables: any = []; //This variable is an array used to keep track of new variables added by the user
  newVariables$: Observable<any[]>; //used to subscribe to changes in the list of new variables from other parts of the application
  newHeaderVariables$: Observable<any[]>; //used to subscribe to changes in the list of new variables from other parts of the application
  fetchedVariables: any = [];
  currentVariables:any =[];
  bots: Bot[] = [];
  selectedBot: Bot;
  newVariableForm: FormGroup;
  newVariableHeaderForm :FormGroup;

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
    this.newVariableHeaderForm = this.fb.group({
      newVariable :['', Validators.required],
      newPlaceholder:['', Validators.required]
    });
    this.newVariableForm = this.fb.group({
      newVariable: ['', Validators.required],
      newPlaceholder: ['', Validators.required],
    });

    this.newVariableHeaderForm.get('newPlaceholder')?.valueChanges.subscribe((value) => {
      if (value && value.trim() !== '') {
        this.newVariableHeaderForm.get('newVariable')?.enable();
      } else {
        this.newVariableHeaderForm.get('newVariable')?.disable();
      }
    });
    this.newVariableForm.get('newPlaceholder')?.valueChanges.subscribe((value) => {
      if (value && value.trim() !== '') {
        this.newVariableForm.get('newVariable')?.enable();
      } else {
        this.newVariableForm.get('newVariable')?.disable();
      }
    });
    this.onChangedVal();
    this.getActiveOrg();
    this.detectVariableChange();
    this.detectHeaderVariableChange();
    this.newVariables$ = this._variableService$.newVariables$.pipe(distinctUntilChanged());
    this.newHeaderVariables$ = this._variableService$.newHeaderVariables$.pipe(distinctUntilChanged());
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

  detectVariableChange() {
    this._sbS.sink = this.newVariableForm.get('newVariable')?.valueChanges
      .pipe(debounceTime(2000)) 
      .subscribe((value) => {
        // Check if the user is currently typing
        if (value !== '' && value !== null) {
          // This code will be executed after the user stops typing for 2 seconds
          this.addVariable();
        }
      });
  
  }

  detectHeaderVariableChange() {
    this._sbS.sink = this.newVariableHeaderForm.get('newVariable')?.valueChanges
      .pipe(debounceTime(2000)) 
      .subscribe((value) => {
        // Check if the user is currently typing
        if (value !== '' && value !== null) {
          // This code will be executed after the user stops typing for 2 seconds
          this.addHeaderVariable();
        }
      });
  
  }
  addHeaderVariable() {
    // Get values from the newVariableForm
    const newVariable = this.newVariableHeaderForm.get('newVariable')?.value;
    const newPlaceholder = this.newVariableHeaderForm.get('newPlaceholder')?.value;
  
    // Determine whether to append to header or body based on user choice
    const formContent = this.templateForm.get('content') as FormGroup;
    const formHeader = formContent.get('header') as FormGroup;
  
    const headerControl = formHeader.get('text') as FormControl;
  
      const updatedHeader = `${headerControl.value}${newPlaceholder}`;
      headerControl.setValue(updatedHeader);
    

    // Track new variables as strings
    this.userAddedVariables.push({
      variable: newVariable,
      placeholder: newPlaceholder,
    });


    this._variableService$.updateHeaderVariables(this.userAddedVariables);
    this.newVariableHeaderForm.get('newVariable')?.reset();
    this.newVariableHeaderForm.get('newPlaceholder')?.reset();
    
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
    this.userAddedVariables.push({
      variable: newVariable,
      placeholder: newPlaceholder,
    });


    this._variableService$.updateNewVariables(this.userAddedVariables);
    this.newVariableForm.get('newVariable')?.reset();
    this.newVariableForm.get('newPlaceholder')?.reset();
    
  }
  onChangedVal() {
    // Determine whether to append to header or body based on user choice
    const formContent = this.templateForm.get('content') as FormGroup;
    const formBody = formContent.get('body') as FormGroup;
    const formHeader = formContent.get('header') as FormGroup;
   
    const bodyControl = formBody.get('text') as FormControl;
    const headerControl = formHeader.get('text') as FormControl;
   


    
    this._sbS.sink = bodyControl.valueChanges.subscribe((value) => {
      // Check if the input field is cleared
      if (value === '') {
        this._variableService$.updateNewVariables([]);
        // this._variableService$.updateHeaderVariables([]);
      } else {
        // Extract variables from the updated body text
        const newVariables = this._variableService$.extractVariables(value);
        // Update currentVariables with only the variables that are present in the input field
        if (this.currentVariables.length !== newVariables.length) {
          this.currentVariables = newVariables;
          this.userAddedVariables = this._variableService$.filterObjectsByPlaceholder(this.userAddedVariables, this.currentVariables);
        }
        this._variableService$.updateNewVariables(this.userAddedVariables);
        // this._variableService$.updateHeaderVariables(this.userAddedVariables);
      }
    });
    
     
     this._sbS.sink = headerControl.valueChanges.subscribe((value) => {
      // Check if the input field is cleared
      if (value === '') {
        this._variableService$.updateHeaderVariables([]);
      } else {
        // Extract variables from the updated header text
        const newVariables = this._variableService$.extractVariables(value);;
        // Update currentVariables with only the variables that are present in the input field
        if(this.currentVariables.length !== newVariables.length){
          this.currentVariables = newVariables;
          // this.newVariables = removeItemsByVariables(this.newVariables, this.currentVariables)  
          this.userAddedVariables = this._variableService$.filterObjectsByPlaceholder(this.userAddedVariables, this.currentVariables)  
        }
        this._variableService$.updateHeaderVariables(this.userAddedVariables);
      }
     }); 
  }
   
  getActiveOrg() {
    this._sbS.sink = this._activeOrgStore$$.get().subscribe((org) => {
      this.orgId = org.id ?? '';
    });
  }

  fetchBots(){
    this._sbS.sink = this._botStateServ$.getBots().subscribe(data =>{
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

   this._sbS.sink = this._variableService$.getVariablesByBot(botId, this.orgId).subscribe(
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

  // Updates the selected variable, hides the card, displays the variables section, and updates the new variable form placeholder.
  updateVariableAndPlaceholder(variable: string) {
    this.selectedVariable = variable;
    this.hideCard();
    if(this.selectedClass == 'header'){
      this.showHeaderSection = true;
      this.showVariablesSection = false;
      this.newVariableHeaderForm.patchValue({ newPlaceholder: `{{${this.selectedVariable}}}` });
    }else{
      this.showVariablesSection = true;
      this.showHeaderSection =false;
      this.newVariableForm.patchValue({ newPlaceholder: `{{${this.selectedVariable}}}` });
    }
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
