import { SubSink } from 'subsink';

import { Component, Input, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { Observable } from 'rxjs';

import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'convl-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListItemComponent implements OnDestroy
{
  private _sb = new SubSink();

  @Input() story: Story;

  loading = true;
  stories$: Observable<Story[]>;

  constructor(private _stories$$: StoriesStore,private _router: Router) { 
    this.stories$ = this._stories$$.get();

  }


  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
