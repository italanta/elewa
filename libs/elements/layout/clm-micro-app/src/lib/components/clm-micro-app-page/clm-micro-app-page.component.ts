import { Component, OnInit } from '@angular/core';

import { take } from 'rxjs';
import { SubSink } from 'subsink';

import { MicroAppStatus } from '@app/model/convs-mgr/micro-app/base';
import { MicroAppStore } from '@app/state/convs-mgr/micro-app';


@Component({
  selector: 'app-clm-micro-app-page',
  templateUrl: './clm-micro-app-page.component.html',
  styleUrls: ['./clm-micro-app-page.component.scss'],
})
export class ClmMicroAppPageComponent implements OnInit
{
  logoUrl = ''
   /** Comprehensive app data */
   app: MicroAppStatus;
  /** Tracking initialization (loading) */
  isInitializing = true;
 
   private _sbS = new SubSink();
 
   constructor(private _microApp$$: MicroAppStore,
   ) {}
 
   ngOnInit()
   {
     // STEP 1. Get app ID
      const app$ = this._microApp$$.get();
      this._sbS.sink = 
       app$.pipe(take(1)).subscribe(a => 
        {
         this.app = a;
         this.isInitializing = false;
         this.logoUrl = a.config.orgLogoUrl || ''
        });
   }
 
   /** Unsubscribe from all subscriptions to prevent memory leaks */
   ngOnDestroy()
   {
     this._sbS.unsubscribe();
   }
}
