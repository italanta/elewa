import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { Bot } from '@app/model/convs-mgr/bots';

@Component({
  selector: 'italanta-apps-main-channel-modal',
  templateUrl: './main-channel-modal.component.html',
  styleUrls: ['./main-channel-modal.component.scss'],
})
export class MainChannelModalComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();
  selectedTab = 1;
  bot: Bot;

  modalData: {selectedPlatform: PlatformType, bot: Bot};
  

  constructor(private router: ActivatedRoute,  
              @Inject(MAT_DIALOG_DATA) public data: { bot: Bot}) {
                this.bot = data.bot;
              }

  ngOnInit() {
    this._sBs.sink = this.router.queryParams.subscribe((params) => {
      this.selectedTab = params['selectedTab'];
    });
  }
  
  getPlatform(value: {selectedPlatform: PlatformType}) {
    this.modalData ={
      selectedPlatform: value.selectedPlatform,
      bot: this.bot,
    }
    this.selectedTab = 2;
}


  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
} 