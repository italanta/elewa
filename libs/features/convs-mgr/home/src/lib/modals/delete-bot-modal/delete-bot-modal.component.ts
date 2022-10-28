import { Component, OnInit } from '@angular/core';


import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-delete-bot-modal',
  templateUrl: './delete-bot-modal.component.html',
  styleUrls: ['./delete-bot-modal.component.scss'],
})
export class DeleteBotModalComponent  {

  constructor(
    private _addStory$: NewStoryService) { }

  }


