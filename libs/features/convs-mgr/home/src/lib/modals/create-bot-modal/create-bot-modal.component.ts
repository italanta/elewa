import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NewStoryService } from '../../services/new-story.service';
import { UploadFileService } from '@app/state/file';
import { Story } from '@app/model/convs-mgr/stories/main';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm: FormGroup;
  modalMode: boolean;
  story: Story;
  // constructor(private _addStory$: NewStoryService, private _formBuilder: FormBuilder, private _addImage$:UploadFileService) {}

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    isEditMode: boolean,
    story ? : Story
  },
  private _addStory$: NewStoryService,
  private _formBuilder: FormBuilder,
  private _addImage$: UploadFileService
) {
this.modalMode = data.isEditMode;
this.story = data.story as Story;
}

  createFormGroup(){
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: ['']
    });
  }


  ngOnInit(): void {
    this.createFormGroup();

    if (this.modalMode) {
      this.updateFormGroup();
    }
  }
  updateFormGroup() {
    this.botForm.patchValue({
      botName: this.story.name,
      botDesc: this.story.description
    });
  }

  add () {
    const bot: Story = {
      name: this.botForm.value.botName,
      description: this.botForm.value.botDesc,
      orgId: ''
    }
    this._addStory$.add(bot.name, bot.description).subscribe();
  }

  update() {
    // Capture changes to bot name and bot description
    this.story.name = this.botForm.value.botName;
    this.story.description = this.botForm.value.botDesc;

    // Update bot details
    this._addStory$.update(this.story);
  }

  submitForm() {
    this.modalMode ? this.update() : this.add();
  }
}
