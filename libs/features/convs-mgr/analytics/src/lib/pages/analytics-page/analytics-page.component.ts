import { Component } from '@angular/core';

import { Observable } from 'rxjs';

import { MetabaseService } from '@app/state/convs-mgr/analytics';
import { User } from '@iote/bricks';

import { UserService } from '@ngfi/angular';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent {

  user$: Observable<User>;
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
    this._mbService.getMetabaseLink().subscribe((res: string) => {
      this.loading = false;
      this.iframeUrl = res;
    });
  }
}
