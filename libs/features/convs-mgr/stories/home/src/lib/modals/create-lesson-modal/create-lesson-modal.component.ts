import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { CREATE_EMPTY_STORY } from '../../providers/forms/story-form.provider';
import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'italanta-apps-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss'],
})
export class CreateLessonModalComponent implements OnInit {
  lessonForm: FormGroup;
  modalMode = false;

  story: Story;
  isSavingStory = false;

  botModules$: Observable<BotModule[]>;

  constructor(
    private _stateStoryServ$: NewStoryService,
    private _botModulesServ$: BotModulesStateService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.createFormGroup();
    this.botModules$ = this._botModulesServ$.getBotModules();
  }

  createFormGroup() {
    this.lessonForm = CREATE_EMPTY_STORY(this._formBuilder);
  }

  add(story: Story, parentModule: BotModule) {
    this._stateStoryServ$.saveStory(story, parentModule);
  }

  update(story: Story, parentModule: BotModule) {
    this._stateStoryServ$.updateStory(story, parentModule);
  }

  submitForm() {
    const story: Story = {
      name : this.lessonForm.value.storyName,
      description : this.lessonForm.value.storyDesc,
      parentModule: this.lessonForm.value.parentModule,
      orgId: '',
    };

    const parentModule = this.lessonForm.value.parentModule as BotModule;
    
    this.isSavingStory = true;
    this.modalMode ? this.update(story, parentModule) : this.add(story, parentModule);
  }
}
