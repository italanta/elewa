import { SubSink } from 'subsink';

import { Component, Input, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { Story } from '@app/model/convs-mgr/stories/main';

import { MatDialog } from '@angular/material/dialog';
import { DeleteBotModalComponent } from '../../modals/delete-bot-modal/delete-bot-modal.component';

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

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
  ){}

  goTo = () => this._router.navigate(['/stories', this.story.id]);

  openEditDialog() {
    // open edit modal
  }

  openDeleteDialog() {
    this._dialog.open(DeleteBotModalComponent, {
      data: { payload: this.story },
      panelClass: 'delete-dialog-container'
    });
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
