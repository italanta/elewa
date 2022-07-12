import { Component, Inject, OnInit } from '@angular/core';
// import { ConfigService } from '@elewa/state/app/versioning';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-version-manager-bar',
  templateUrl: './version-manager-bar.component.html',
  styleUrls: [ './version-manager-bar.component.scss' ]
})
export class VersionManagerBar implements OnInit
{
  private _sbS = new SubSink();

  isLoaded = false;
  needsUpdate = false;

  constructor(@Inject('ENVIRONMENT') private _environment: { appVersion: string },
             )// private _configProvider: ConfigService)
  { }

  ngOnInit()
  {
    // const version$ = this._configProvider.getVersioning();
    // this._sbS.sink = version$.subscribe(v => {
    //                     this.needsUpdate = v.current !== this._environment.appVersion;
    //                     this.isLoaded = true;
    //                   });
  }

  hardRefresh() {
    if(window.location)
      window.location.reload(true);
  }

}

