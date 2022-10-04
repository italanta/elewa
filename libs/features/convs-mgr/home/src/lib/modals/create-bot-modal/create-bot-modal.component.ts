import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-create-bot-modal',
  templateUrl: './create-bot-modal.component.html',
  styleUrls: ['./create-bot-modal.component.scss'],
})
export class CreateBotModalComponent implements OnInit {
  botForm = this._formBuilder.group({
    botName: [this._addStory$.generateName()],
    botDesc: ['']
  });

  constructor(private _addStory$: NewStoryService, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  add = () => this._addStory$.add().subscribe();
}
