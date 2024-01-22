import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { BotsModuleService } from '../../services/bots-module.service';

@Component({
  selector: 'italanta-apps-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit{
  selectedPlatform:PlatformType;
  channels:CommunicationChannel[];
  selectedChannelId:string;
  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { selectedPlatform: PlatformType , botId:any },
    private botsService :BotsModuleService,
    private dialogRef: MatDialogRef<ChannelComponent>,
    private _dialog: MatDialog
    ){}


  ngOnInit(): void {
      this.fetchChannels()
  }  
  
  fetchChannels(){
    if (this.data.selectedPlatform === PlatformType.WhatsApp) {
      this.botsService.getWhatsAppChannels().subscribe((channels) => {
        this.channels = channels
      })
    } else {
      this.botsService.getMessengerChannels().subscribe((channels) => {
        this.channels = channels
      })
    }
   }
   onChannelChange(channelId: any){
    this.selectedChannelId = channelId;
   }

  addBotToChannel() {
    if (!this.channels || this.channels.length === 0 || !this.selectedChannelId) {
      return;
    }
  
    // Find the selected channel
    const selectedChannel = this.channels.find((channel) => channel.id === this.selectedChannelId);
  
    if (!selectedChannel) {
      return;
    }
  
    const botId = this.data.botId;
  
    // Add the botId to the selected channel
    selectedChannel.linkedBot = botId;
  
    // Update the channel
    this.botsService.updateChannel(selectedChannel).subscribe(() => {
      this._dialog.closeAll(); // Close the dialog after updating the channel
    });
  }
   

  returnToPlatform(){
      this.dialogRef.close()

  }

}
