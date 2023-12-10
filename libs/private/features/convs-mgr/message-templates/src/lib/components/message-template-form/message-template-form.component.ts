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

import { Observable, map } from 'rxjs';

import { MessageTemplate } from '@app/model/convs-mgr/functions';
import { MessageTemplatesService } from '@app/private/state/message-templates';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

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

  templateId: string;
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
    private _route: ActivatedRoute,
    private _route$$: Router,
    private _snackbar: SnackbarService,
    private _channelService: CommunicationChannelService
  ) {}

  ngOnInit() {
    this.templateForm = createTemplateForm(this.fb);
    this.initPage();

    this.channels$ = this._channelService.getAllChannels();

    this.newVariableForm = this.fb.group({
      newVariable: ['', Validators.required],
      newPlaceholder: ['', Validators.required],
    });
    // Subscribe to changes in the content.body control
    this.subscribeToBodyControlChanges();
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
