import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm: FormGroup;
  modalMode: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {mode: string},
    private _addStory$: NewStoryService,
    private _formBuilder: FormBuilder) {
      this.modalMode = data.mode;
    }

  createFormGroup(){
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: ['']
    });
  }

  getModalMode(){
    return {
      create: "Create Mode",
      edit: "Edit Mode"
    }
  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  add = () => this._addStory$.add(this.botForm.value.botName as string, this.botForm.value.botDesc as string || '').subscribe();
}
