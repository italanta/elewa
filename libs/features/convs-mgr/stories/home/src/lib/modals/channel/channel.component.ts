import { Component, Inject, Input, OnChanges,  SimpleChanges } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { BotsModuleService } from '../../services/bots-module.service';

@Component({
  selector: 'italanta-apps-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnChanges{
  private _selectedPlatformAndBot: {selectedPlatform: PlatformType, botId: string};
  
  @Input() set selectedPlatformAndBot(value: { selectedPlatform: PlatformType, botId: string }) {
    this._selectedPlatformAndBot = value;
    if (this._selectedPlatformAndBot && this._selectedPlatformAndBot.selectedPlatform !== undefined) {
      this.fetchChannels();
    }
  }

   
   
  // selectedPlatform:PlatformType;
  channels:CommunicationChannel[];
  selectedChannelId:string;
  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { selectedPlatform: PlatformType , botId:string },
    private botsService :BotsModuleService,
    private dialogRef: MatDialogRef<ChannelComponent>,
    private _dialog: MatDialog
    ){}

    
    ngOnChanges(changes: SimpleChanges) {
      if (changes['selectedPlatformAndBot'] && changes['selectedPlatformAndBot'].currentValue) {
        this.fetchChannels();
      }
    }
     
     
  
  
     fetchChannels() {
      // Check if selectedPlatformAndBot and selectedPlatform are defined
      if (this._selectedPlatformAndBot && this._selectedPlatformAndBot.selectedPlatform) {
        this.botsService.getChannelsByType(this._selectedPlatformAndBot.selectedPlatform).subscribe((channels) => {
          this.channels = channels;
        });
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
