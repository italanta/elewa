import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm: FormGroup;
  constructor(private _addStory$: NewStoryService, private _formBuilder: FormBuilder) {}

  createFormGroup(){
    this.botForm = this._formBuilder.group({
      botName: [this._addStory$.generateName()],
      botDesc: ['']
    });
  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  add = () => this._addStory$.add(this.botForm.value.botName as string, this.botForm.value.botDesc as string || '').subscribe();
}
