import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { StoriesStore } from '@app/state/convs-mgr/stories';

import { Story } from '@app/model/convs-mgr/stories/main';

import { CREATE_BOT_MODULE_FORM, SUBSTORY_TYPES, DEFAULT_SUBSTORY_TYPE, CreateStoryModuleForm } from './create-module-form';
import { CreateStorySubModuleProvider } from '../../providers/create-story-sub-module.provider';

/**
 * Modal to create a module.
 * Determines which type of module you wish to create and add to the story.
 */
@Component({
  selector: 'lib-create-module-modal',
  templateUrl: './create-module-modal.component.html',
  styleUrls: ['./create-module-modal.component.scss'],
})
export class CreateModuleModalComponent implements OnInit, OnDestroy 
{
  private _sBs = new SubSink();

  _form: FormGroup;

  selectableChildTypes = SUBSTORY_TYPES;
  selectedType = DEFAULT_SUBSTORY_TYPE.value;
  isSaving = false;

  constructor(
    private _stories$$: StoriesStore,
    private _createStory$: CreateStorySubModuleProvider,
              
    private _formBuilder: FormBuilder,
    private _dialog: MatDialogRef<CreateModuleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { blockId: string }) 
  { }

  ngOnInit(): void {
    this._form = CREATE_BOT_MODULE_FORM(this._formBuilder);
  }

  submit() 
  {
    if(this._form.valid && !this.isSaving)
    {
      this.isSaving = true;

      this._sBs.sink = 
        this._createStory$
            .createSubstory(this.data.blockId, 
                            this._form.value as CreateStoryModuleForm)
          // Once the child story is created, communicate it down to the block
          .subscribe(
          (child: Story) => 
              this._dialog.close(child));
    }
  }

  exit() {
    this._dialog.close(false);
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
