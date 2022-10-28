import { SubSink } from 'subsink';

import { Component, Input, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';
import { EditBotModalComponent } from '../../modals/edit-bot-modal/edit-bot-modal.component';
import { DeleteBotModalComponent } from '../../modals/delete-bot-modal/delete-bot-modal.component';
import { Story } from '@app/model/convs-mgr/stories/main';
import { MatDialog } from '@angular/material/dialog';
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
  constructor(private _router: Router, private dialog : MatDialog) { }

  goTo = () => this._router.navigate(['/stories', this.story.id]);


  editDialog(){
    this.dialog.open(EditBotModalComponent)
  }

  deleteDialog(){

    this.dialog.open(DeleteBotModalComponent)
}
  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
