import { Component } from '@angular/core';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { Observable } from 'rxjs';
import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'convl-italanta-apps-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.css'],
})
export class StoryListComponent  {

  
  stories$: Observable<Story[]>;

  constructor(private _stories$$: StoriesStore,) {
    this.stories$ = this._stories$$.get();

  }

  
}
