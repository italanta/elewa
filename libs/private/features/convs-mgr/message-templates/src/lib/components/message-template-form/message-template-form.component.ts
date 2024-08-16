import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SubSink } from 'subsink';

import { Observable, map } from 'rxjs';

import { MessageTemplate, VariableExample } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { ActiveOrgStore } from '@app/private/state/organisation/main';
import { VariablesService } from '@app/features/convs-mgr/stories/blocks/process-inputs';
import { StoryBlockVariable } from '@app/model/convs-mgr/stories/blocks/main';
import { Bot } from '@app/model/convs-mgr/bots';

import { createTemplateForm } from '../../providers/create-empty-message-template-form.provider';
import { SnackbarService } from '../../services/snackbar.service';
import { categoryOptions, languageOptions } from '../../utils/constants';
import { HeaderVariablesSampleSectionComponent } from '../header-variables-sample-section/header-variables-sample-section.component';
import { BodyVariablesSampleSectionComponent } from '../body-variables-sample-section copy/body-variables-sample-section.component';
@Component({
  selector: 'app-message-template-form',
  templateUrl: './message-template-form.component.html',
  styleUrls: ['./message-template-form.component.scss'],
})
export class MessageTemplateFormComponent implements OnInit, OnDestroy
{
  @ViewChild('textAreaElement') textAreaElement: ElementRef;
  @ViewChild('headerSection')
  headerSection: HeaderVariablesSampleSectionComponent;

  @ViewChild('bodySection')
  bodySection: BodyVariablesSampleSectionComponent;

  template$: Observable<MessageTemplate | undefined>;
  template: MessageTemplate;
  channels$: Observable<CommunicationChannel[]>;
  deletedExamples: VariableExample[] = [];

  templateForm: FormGroup;
  content: FormGroup;

  orgId: string;
  selectedVariable: string;
  showCard: boolean;
  selectedClass: string;
  botName: string;

  templateId: string;
  panelOpenState: boolean;
  isSaving: boolean;
  showVariablesSection: boolean;
  showHeaderExampleSection: boolean;
  showBodyExampleSection: boolean;
  showSelectedVariableSection: boolean;

  categories: { display: string; value: string; }[] = categoryOptions;
  languages: { display: string; value: string; }[] = languageOptions;


  fetchedVariables: any = [];
  currentVariables: any = [];
  bots: Bot[] = [];
  selectedBot: Bot;

  private _sbS = new SubSink();

  constructor(
    private fb: FormBuilder,
    private _messageTemplatesService: MessageTemplatesService,
    private _route: ActivatedRoute,
    private _route$$: Router,
    private _snackbar: SnackbarService,
    private _botStateServ$: BotsStateService,
    private _channelService: CommunicationChannelService,
    private _variableService$: VariablesService,
    private _activeOrgStore$$: ActiveOrgStore,
  ) { }

  ngOnInit()
  {
    this.templateForm = createTemplateForm(this.fb);

    // Set listeners for value changes on body and header
    //  We use this to detect and update the variables added
    this.onBodyChange();
    this.onHeaderChange();
    this.onExamplesChange();
    this.showCard = true;
    this.channels$ = this._channelService.getAllChannels();
    this.getActiveOrg();
  }

  initPage()
  {
    this._sbS.sink = this._route.params
      .pipe(map((params) => params['id'] as string))
      .subscribe((templateId) =>
      {
        if (templateId) {
          this.template$ = this._messageTemplatesService.getTemplateById(templateId);

          this._sbS.sink = this.template$.subscribe((template) =>
          {
            if (template) {
              this.template = template;
              this.templateForm = createTemplateForm(this.fb, template);

              this.showHeaderExampleSection = this.templateForm.controls['headerExamples'].value.length > 0;
              this.showBodyExampleSection = this.templateForm.controls['bodyExamples'].value.length > 0;
            }
          });
        }
      });
  }

  onBodyChange()
  {
    this._sbS.sink = this.templateForm.get('content.body.text')?.valueChanges.subscribe(changes =>
    {
      this.removeOnChange(changes, 'body');
      this.restoreOnChange(changes, 'body');
    });
  }

  onHeaderChange()
  {
    this._sbS.sink = this.templateForm.get('content.header.text')?.valueChanges.subscribe(changes =>
    {
      this.removeOnChange(changes, 'header');
      this.restoreOnChange(changes, 'header');
    });
  }

  onExamplesChange()
  {
    this._sbS.sink = this.templateForm.get('headerExamples')?.valueChanges.subscribe((changes: any[]) =>
    {
      this.showHeaderExampleSection = changes.length > 0;
    });

    this._sbS.sink = this.templateForm.get('bodyExamples')?.valueChanges.subscribe((changes: any[]) =>
    {

      this.showBodyExampleSection = changes.length > 0;
    });

  }

  removeOnChange(change: string, section: 'body' | 'header')
  {

    if(section == 'body') {

      const examplesArray = this.templateForm.get('bodyExamples')?.value as VariableExample[];
  
      examplesArray.forEach((exmp) =>
      {
        const variable = `{{${exmp.name}}}`;
  
        if (!change.includes(variable)) {
          exmp.section = section;
          this.removeExample(exmp.name as string, section);
          this.deletedExamples.push(exmp);
        }
      });
    } else {
      const examplesArray = this.templateForm.get('headerExamples')?.value as VariableExample[];
      
      examplesArray.forEach((exmp) =>
      {
        const variable = `{{${exmp.name}}}`;
        
        if (!change.includes(variable)) {
          exmp.section = section;
          this.removeExample(exmp.name as string, section);
          this.deletedExamples.push(exmp);
        }
      });

    }

  }

  restoreOnChange(change: string, section: 'body' | 'header')
  {
    if (this.deletedExamples.length > 0) {

      this.deletedExamples.forEach((exmp) =>
      {
        const variable = `{{${exmp.name}}}`;

        if (exmp.section === section && change.includes(variable)) {
          this.addExample(exmp.name as string, section, true);

          this.deletedExamples = this.deletedExamples.filter((dExmp) => dExmp.name !== exmp.name);
        }
      });
    }
  }

  addExample(name: string, section: 'body' | 'header', existsInForm?: boolean)
  {
    if (!existsInForm) {
      const newValue = `${this.templateForm.value.content[section].text} {{${name}}}`;

      this.templateForm.patchValue({ content: { [section]: { text: newValue } } });
    }

    if (section === 'body') {
      this.bodySection.addExample(name);
    } else {
      this.headerSection.addExample(name);
    }
  }

  removeExample(name: string, section: 'body' | 'header')
  {
    if (section === 'body') {
      this.bodySection.removeExample(name);
    } else {
      this.headerSection.removeExample(name);
    }
  }


  getActiveOrg()
  {
    this._sbS.sink = this._activeOrgStore$$.get().subscribe((org) =>
    {
      this.orgId = org.id ?? '';
    });
  }

  fetchBots()
  {
    this._sbS.sink = this._botStateServ$.getBots().subscribe(data =>
    {
      this.bots = data;
    });
  }

  onBotSelected(botId: any, botName: string, selectedClass: string)
  {
    this.showCard = true;
    this.selectedClass = selectedClass;
    this.botName = botName;

    this._sbS.sink = this._variableService$.getVariablesByBot(botId, this.orgId).subscribe(
      (data: StoryBlockVariable[]) =>
      {
        this.fetchedVariables = data;
      }
    );
  }


  cancel()
  {
    this._route$$.navigate(['/messaging']);
  }

  openTemplate()
  {
    this._route$$.navigate(['/messaging']);
  }

  save()
  {
    if (this.templateForm.value.id) {
      this.updateTemplate();
    } else {
      this.saveTemplate();
    }
  }

  updateTemplate()
  {
    this.isSaving = true;

    this._sbS.sink = this._messageTemplatesService
      .updateTemplateMeta(this.templateForm.value)
      .subscribe((response) => {
        if (response.success) {
          this._sbS.sink = this._messageTemplatesService
            .updateTemplate(this.templateForm.value)
            .subscribe(() =>
            {
              this._snackbar.showSuccess('Template updated successfully');
              this.isSaving = false;
            });
        }
      });
  }

  hideCard()
  {
    this.showCard = false;
  }


  saveTemplate()
  {
    if (!this.templateForm.valid) {
      this._snackbar.showError('Please fill out all fields');
      return;
    }

    this.isSaving = true;
    this._sbS.sink = this._messageTemplatesService
      .createTemplateMeta(this.templateForm.value)
      .subscribe((response) =>
      {
        if (!response.success) {
          this.isSaving = false;
          this._snackbar.showError(response);
        }

        this.templateForm.value.templateId = response.data.id;

        const templateId = `${this.templateForm.value.name}${this.templateForm.value.language}`;

        this._sbS.sink = this._messageTemplatesService
          .addMessageTemplate(this.templateForm.value, templateId)
          .subscribe(() =>
          {
            this.isSaving = false;
            this._snackbar.showSuccess('Template created successfully');
            this.openTemplate();
          });
      });
  }

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
