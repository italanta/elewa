import { Component, Inject, OnInit, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { BotMutationEnum } from '@app/model/convs-mgr/bots';

import { STORY_FORM } from '../../providers/forms/story-form.provider';
import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'italanta-apps-create-lesson-modal',
  templateUrl: './create-lesson-modal.component.html',
  styleUrls: ['./create-lesson-modal.component.scss'],
})
export class CreateLessonModalComponent implements OnInit {
  private _sBs = new SubSink();

  selectedBotModule: BotModule;

  @Input()
  set botModFromStepper(value: BotModule) {
    this.getBotModules(value) // this is called onInit with an undefined value so we don't add it to ngOnInit
  }

  lessonForm: FormGroup;
  isCreateMode: boolean;

  story: Story;
  isSavingStory = false;

  botModules: BotModule[];

  constructor(
    private _stateStoryServ$: NewStoryService,
    private _botModulesServ$: BotModulesStateService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { botMode: BotMutationEnum; story?: Story, botModId?: string }
  ) {
    this.isCreateMode = data.botMode === BotMutationEnum.CreateMode;
    this.data.story ? this.story = this.data.story : ''
  }

  ngOnInit() {
    this.lessonForm = STORY_FORM(this._formBuilder, this.story)
    this.getBotModules();
  }

  getBotModules(value?: BotModule) {
    this._sBs.sink = this._botModulesServ$.getBotModules().subscribe((botMods) => {
      this.botModules = botMods;

      // creating within module
      if (!value && this.data.botModId) {
        this.selectedBotModule = botMods.find((botMod) => botMod.id === this.data.botModId) as BotModule;
      }

      // editing existing botModule
      if (!value && this.story) {
        this.selectedBotModule = botMods.find((botMod) => botMod.id === this.story.parentModule) as BotModule;
      }

      // creating in matstepper
      if (value) {
        this.selectedBotModule = botMods.find((botMod) => botMod.id === value.id) as BotModule;
      }
    })
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
