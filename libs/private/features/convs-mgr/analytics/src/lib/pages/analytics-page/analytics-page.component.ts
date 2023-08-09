import { Component, OnDestroy } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { User } from '@iote/bricks';
import { UserService } from '@ngfi/angular';

import { MetabaseService } from '@app/private/state/analytics';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent implements OnDestroy {

  user$: Observable<User>;
  _sBs = new SubSink();
  loading = true;

  iframeUrl: string;

  constructor(_userService: UserService<User>,
              private _mbService: MetabaseService)
  {
    this.user$ = _userService.getUser();

    this.user$.subscribe(user => 
                          {
                            this.generateMetabaseLink()
                            this.loading = false;

                            // if(!!user.profile.metabaseUrl)
                            // {
                            //   this.iframeUrl = user.profile.metabaseUrl;
                            //   this.loading = false;
                            // }
                            // else
                            // {
                            //   this.generateMetabaseLink()
                            // }
                          })
  }

  //Call backend fn that generates metabase link
  generateMetabaseLink()
  {
   this._sBs.sink = this._mbService.getMetabaseLink().subscribe((res: string) => {
      this.loading = false;
      this.iframeUrl = res;
    });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
