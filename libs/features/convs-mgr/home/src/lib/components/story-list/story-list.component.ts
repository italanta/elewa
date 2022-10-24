import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'convl-italanta-apps-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnInit {
  stories$: Observable<Story[]>;
  filterInput$$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private _stories$$: StoriesStore) {
    this.stories$ = this._stories$$.get();
  }
  ngOnInit(): void {
    this.filterBotTemplates();
  }
  //A function that subscribes to when the search control changes and filters the bots list
  filterBotTemplates() {
    this.stories$ = combineLatest([this.filterInput$$, this.stories$]).pipe(
      map(([filter, botsArray]) =>
        botsArray.filter((story: Story) => {
          return story.name.toString().toLowerCase().includes(filter);
        })
      )
    );
  }
  filterBots(event: any) {
    this.filterInput$$.next(event.target.value);
  }
}