import { Component, Input, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { Story } from '@app/model/convs-mgr/stories/main';
import { CreateBotModalComponent } from '../../modals/create-bot-modal/create-bot-modal.component';

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
  constructor(private _router: Router, private _dialog : MatDialog) { }

  goTo = () => this._router.navigate(['/stories', this.story.id]);

  openEditDialog(){
    this._dialog.open(CreateBotModalComponent, {
      data: {
        isEditMode: true,
        story: this.story
      },
      minWidth: '600px',
      minHeight: 'fit-content'
    });
  }

  openDeleteDialog() {
    this._dialog.open(DeleteBotModalComponent, {
      data: { payload: this.story },
      panelClass: 'delete-dialog-container'
    });
  }

  truncateDesc(desc: string): string {
    let text = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;
    return text.length > 0 ? text : 'No description';
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
