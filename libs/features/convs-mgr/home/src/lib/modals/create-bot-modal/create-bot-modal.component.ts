import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Story } from '@app/model/convs-mgr/stories/main';

import { NewStoryService } from '../../services/new-story.service';
import { UploadFileService } from '@app/state/file';


@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm: FormGroup;
  modalMode: string;
  story: Story;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: string,
      story ? : Story
    },
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder,
    private _addImage$: UploadFileService) {
    this.modalMode = data.mode;
    this.story = data.story as Story;
  }


  createFormGroup() {
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: ['']
    });
  }


  updateFormGroup() {
    if (this.modalMode === this.getModalMode().edit) {
      this.botForm.patchValue({
        botName: this.story.name,
        botDesc: this.story.description
      });
    }
  }

  getModalMode() {
    return {
      create: "Create Mode",
      edit: "Edit Mode"
    }as const;
  }

  ngOnInit(): void {
    this.createFormGroup();
    this.updateFormGroup();
  }

  add = () => this._addStory$.add(this.botForm.value.botName as string, this.botForm.value.botDesc as string || '').subscribe();

  update() {
    // Capture changes to bot name and bot description
    this.story.name = this.botForm.value.botName;
    this.story.description = this.botForm.value.botDesc;

    // Update bot details
    this._addStory$.update(this.story);
  }
}
