import { Component, OnDestroy } from '@angular/core';
import { Router }    from '@angular/router';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';

import { UserStore } from '@app/state/user';
import { ActiveOrgStore } from '@app/state/organisation';
import { User } from '@iote/bricks';


@Component({
  selector: 'convl-home',
  templateUrl: './home.page.html',
 // styleUrls: ['./home.component.scss']
})
export class HomePageComponent implements OnDestroy
{
  private _sb = new SubSink();

  title: string;

  user$: Observable<iTalUser>;
  org$ : Observable<Organisation>;

  loading = true;

  constructor(_user$$: UserStore,
              _org$$ : ActiveOrgStore,

              private _router: Router)
  {
    this.user$ = _user$$.getUser();
    this.org$  = _org$$.get();
  }

  getUserName = (u: User | null) => u?.displayName as string;
  orgName$  = () => this.org$ .pipe(map(u => u?.id as string));

  goTo(area: string)
  {
    this._sb.sink =
      this.org$.pipe(take(1))
          .subscribe((org) => this._router.navigate(['org', org.id, area]));
  }

  ngOnDestroy()
  {
    this._sb.unsubscribe();
  }
}
