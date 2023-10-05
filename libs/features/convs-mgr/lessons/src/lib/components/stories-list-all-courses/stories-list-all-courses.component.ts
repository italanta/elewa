import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map, tap } from 'rxjs';

import { orderBy as __orderBy } from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'app-stories-list-all-courses',
  templateUrl: './stories-list-all-courses.component.html',
  styleUrls: ['./stories-list-all-courses.component.scss'],
})
export class StoriesListAllCoursesComponent implements OnInit {
  
  @Input() bots$: Observable<Story[]>;

  defaultImageUrl = `https://res.cloudinary.com/dyl3rncv3/image/upload/v1695626490/photo-1541746972996-4e0b0f43e02a_o9ukmi.jpg`

  bots: Story[];

  screenWidth: number;

  constructor(private _router$$: Router) {}

  ngOnInit(): void {

    this.screenWidth = window.innerWidth;

    if (this.bots$) {
      this.bots$.pipe(
        map((s) => __orderBy(s,(a) => __DateFromStorage(a.createdOn as Date).unix(), 'desc')),
        tap((s) => this.bots = s)).subscribe();
    }
  }

  openBot(id: string) {
    this._router$$.navigate(['bots', id]);
  }
}
