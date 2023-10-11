import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { CREATE_EMPTY_STORY } from '../../providers/forms/story-form.provider';
import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'italanta-apps-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss'],
})
export class CreateLessonModalComponent implements OnInit {
  lessonForm: FormGroup;
  isCreateMode: boolean;

  story: Story;
  isSavingStory = false;

  botModules$: Observable<BotModule[]>;

  constructor(
    private _stateStoryServ$: NewStoryService,
    private _botModulesServ$: BotModulesStateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: { botMode: BotMutationEnum; story?: Story }
  ) {
    this.isCreateMode = data.botMode === BotMutationEnum.CreateMode;
    this.data.story ? this.story = this.data.story : ''
  }

  ngOnInit() {
    this.createFormGroup();

    if (!this.isCreateMode) {
      this.updateFormGroup();
    }

    this.botModules$ = this._botModulesServ$.getBotModules();
  }

  createFormGroup() {
    this.lessonForm = CREATE_EMPTY_STORY(this._formBuilder);
  }

  updateFormGroup() {
    this.lessonForm.patchValue({
      id: this.story.id,
      storyName: this.story.name,
      storyDesc: this.story.description,
      parentModule: this.story.parentModule,
    });
  }

  add(story: Story, parentModule: BotModule) {
    this._stateStoryServ$.saveStory(story, parentModule);
  }

  update(story: Story, parentModule: BotModule) {
    this._stateStoryServ$.updateStory(story, parentModule, this.data.story?.parentModule as string);
  }

  submitForm() {
    const story: Story = {
      id: this.lessonForm.value.id,
      name: this.lessonForm.value.storyName,
      description: this.lessonForm.value.storyDesc,
      parentModule: this.lessonForm.value.parentModule.id,
      orgId: '',
    };

    const parentModule = this.lessonForm.value.parentModule as BotModule;

    this.isSavingStory = true;
    this.isCreateMode
      ? this.add(story, parentModule)
      : this.update(story, parentModule);
  }
}
