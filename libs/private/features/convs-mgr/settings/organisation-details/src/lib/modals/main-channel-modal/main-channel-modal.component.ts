import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

@Component({
  selector: 'app-main-channel-modal',
  templateUrl: './main-channel-modal.component.html',
  styleUrls: ['./main-channel-modal.component.scss'],
})
export class MainChannelModalComponent implements OnInit, OnDestroy
{
  private _sBs = new SubSink();
  selectedTab = 1;
  channel: CommunicationChannel;

  modalData: { selectedPlatform: PlatformType, channel: CommunicationChannel; };

  constructor(private router: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: { channel: CommunicationChannel; })
  {
    this.channel = data.channel;
  }

  ngOnInit()
  {
    this._sBs.sink = this.router.queryParams.subscribe((params) =>
    {
      this.selectedTab = params['selectedTab'];
    });
  }

  getPlatform(value: { selectedPlatform: PlatformType; })
  {
    this.modalData = {
      selectedPlatform: value.selectedPlatform,
      channel: this.channel,
    };
    this.selectedTab = 2;
  }

  ngOnDestroy(): void
  {
    this._sBs.unsubscribe();
  }
} 