import { SubSink } from 'subsink';

import { Component, Input, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Story } from '@app/model/convs-mgr/stories/main';
import { CreateBotModalComponent } from '../../modals/create-bot-modal/create-bot-modal.component';
import { NewStoryService } from '../../services/new-story.service';


@Component({
  selector: 'convl-story-list-item',
  templateUrl: './story-list-item.component.html',
  styleUrls: ['./story-list-item.component.scss']
})
export class StoryListItemComponent implements OnDestroy
{
  private _sb = new SubSink();

  @Input() story: Story;

  loading = true;
  constructor(private _router: Router, private _dialog : MatDialog) { }

  goTo = () => this._router.navigate(['/stories', this.story.id]);

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }

  openDialog(){
    this._dialog.open(CreateBotModalComponent, {
      data: {
        mode: "Edit Mode",
        story: this.story
      }
    });
  }
}
