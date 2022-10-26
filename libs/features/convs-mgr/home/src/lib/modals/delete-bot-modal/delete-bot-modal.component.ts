import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Story } from '@app/model/convs-mgr/stories/main';
import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-delete-bot-modal',
  templateUrl: './delete-bot-modal.component.html',
  styleUrls: ['./delete-bot-modal.component.scss'],
})
export class DeleteBotModalComponent {
  story!: Story;

  constructor(
    private _addStory$: NewStoryService,
    @Inject(MAT_DIALOG_DATA) public data: { payload : Story },
  ) { this.story = this.data.payload }


  delete() {
    this._addStory$.remove(this.story);
  }
}
