import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';

import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';



@Component({
  selector: 'italanta-apps-main-channel-modal',
  templateUrl: './main-channel-modal.component.html',
  styleUrls: ['./main-channel-modal.component.scss'],
})
export class MainChannelModalComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();
  selectedTab = 1;
  selectedPlatformAndBot: {selectedPlatform: PlatformType, botId: string};
  

  constructor(private router: ActivatedRoute) {}

  ngOnInit() {
    this._sBs.sink = this.router.queryParams.subscribe((params) => {
      this.selectedTab = params['selectedTab'];
    });
  }
  
  handlePlatformAndBotSelected(value: {selectedPlatform: PlatformType, botId: string}) {
    this.selectedPlatformAndBot = value;
    this.selectedTab = 2;
}


  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
} 