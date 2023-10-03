import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { NewStoryService } from '../../services/new-story.service';

@Component({
  selector: 'convl-italanta-apps-delete-bot-modal',
  templateUrl: './delete-bot-modal.component.html',
  styleUrls: ['./delete-bot-modal.component.scss'],
})
export class DeleteBotModalComponent {
  story!: Story;
  parentModule!: BotModule;

  constructor(
    private _addStory$: NewStoryService,
    @Inject(MAT_DIALOG_DATA) public data: { story: Story; parentModule: BotModule }
  ) {
    this.story = this.data.story
    this.parentModule = this.data.parentModule
  }

  delete() {
    if (this.story && this.parentModule) {
      this._addStory$.removeStory(this.story, this.parentModule);
    }
  }
}
