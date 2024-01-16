import { Component, Inject, OnInit } from '@angular/core';
import { BotsModuleService } from '../../services/bots-module.service';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'italanta-apps-connect-to-channel-modal',
  templateUrl: './connect-to-channel-modal.component.html',
  styleUrls: ['./connect-to-channel-modal.component.scss'],
})



export class ConnectToChannelModalComponent {
  channels:CommunicationChannel[];
  showPlatform:boolean;
  selectedPlatform: PlatformType;
  channelForm:FormGroup;
  selectedChannelId:string;
  whatsappValue: PlatformType = PlatformType.WhatsApp;
  messengerValue: PlatformType = PlatformType.Messenger;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private botsService :BotsModuleService,
    private _dialog: MatDialog
    ){}


  returnToPlatform(){
    this.selectedPlatform=PlatformType.None;
    this.showPlatform=false;
  }

  onPlatformSelected(){
    this.showPlatform = true;
    this.onChannelFormSubmit();
   }
   
  onChannelFormSubmit(){
    if (this.selectedPlatform === PlatformType.WhatsApp) {
      this.botsService.getWhatsAppChannels().subscribe((channels) => {
        this.channels = channels
      })
    } else {
      this.botsService.getMessengerChannels().subscribe((channels) => {
        this.channels = channels
      })

    }
  }
  addBotToChannel() {
    if (!this.channels || this.channels.length === 0 || !this.selectedChannelId) {
      console.error('Invalid channel selection');
      return;
    }
  
    // Find the selected channel
    const selectedChannel = this.channels.find((channel) => channel.id === this.selectedChannelId);
  
    if (!selectedChannel) {
      console.error('Selected channel not found');
      return;
    }
  
    const botId = this.data.botId;
  
    // Add the botId to the selected channel
    selectedChannel.bot = botId;
  
    // Log the botId associated with the selected channel
    console.log('BotId associated with the selected channel:', selectedChannel.bot);
  
    // Update the channel
    this.botsService.updateChannel(selectedChannel).subscribe(() => {
      this._dialog.closeAll(); // Close the dialog after updating the channel
    });
  }
  
  
}
