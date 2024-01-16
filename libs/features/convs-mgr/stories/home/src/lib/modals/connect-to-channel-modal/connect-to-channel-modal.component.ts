import { Component, OnInit } from '@angular/core';
import { BotsModuleService } from '../../services/bots-module.service';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

@Component({
  selector: 'italanta-apps-connect-to-channel-modal',
  templateUrl: './connect-to-channel-modal.component.html',
  styleUrls: ['./connect-to-channel-modal.component.scss'],
})


export class ConnectToChannelModalComponent implements OnInit{
  channels:CommunicationChannel[];
  selectedPlatform:string;
  
  constructor(private botsService :BotsModuleService){}

  ngOnInit(): void {
      this.botsService.getChannels().subscribe((channels) => {
        this.channels = channels
      })
  }


  onPlatformSelected(platform:string){
    this.selectedPlatform = platform
  }
}
