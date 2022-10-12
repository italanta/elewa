import { SubSink } from 'subsink';

import { Component, Input, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { Story } from '@app/model/convs-mgr/stories/main';

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

  constructor(private _router: Router) { }

  goTo = () => this._router.navigate(['/stories', this.story.id]);

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
