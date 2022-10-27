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
  editBotForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {mode: string, story?: Story},
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder,
    private _addImage$:UploadFileService) {
      this.modalMode = data.mode;
      this.story = data.story as Story;
    }


  createFormGroup(){
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      // botImage: [this._addImage$.uploadFile(File)],
      botDesc: ['']
    });
  }


  createEditFormGroup(){
    this.editBotForm = this._formBuilder.group({
      botName: [this.story.name],
      botDesc: [this.story.description]
    });
  }

  getModalMode(){
    return {
      create: "Create Mode",
      edit: "Edit Mode"
    }
  }

  ngOnInit(): void {
    if(this.modalMode === this.getModalMode().create){
      this.createFormGroup();
    } else {
      this.createEditFormGroup();
    }
  }

  add = () => this._addStory$.add(this.botForm.value.botName as string, this.botForm.value.botDesc as string || '').subscribe();

  update() {
    this.story.name = this.editBotForm.value.botName;
    this.story.description = this.editBotForm.value.botDesc;
    this._addStory$.update(this.story);
  }
}
