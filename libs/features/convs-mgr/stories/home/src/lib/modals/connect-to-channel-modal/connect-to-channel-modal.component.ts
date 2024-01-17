import { Component, Inject, OnInit } from '@angular/core';
import { BotsModuleService } from '../../services/bots-module.service';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChannelComponent } from '../channel/channel.component';

@Component({
  selector: 'italanta-apps-connect-to-channel-modal',
  templateUrl: './connect-to-channel-modal.component.html',
  styleUrls: ['./connect-to-channel-modal.component.scss'],
})



export class ConnectToChannelModalComponent {
  channels:CommunicationChannel[];
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


    openChannel(){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.width = '30rem'; // Set the width of the dialog
      dialogConfig.height = '25rem'; // Set the height of the dialog
      dialogConfig.data = { selectedPlatform: this.selectedPlatform , botId:this.data};
      this._dialog.open(ChannelComponent, dialogConfig);
    }
    
  returnToPlatform(){
    this.selectedPlatform=PlatformType.None;
  }

  onPlatformSelected(){
    this.openChannel();
   }
   
   closeDialog(){
    this._dialog.closeAll();
   }
  
  
  
}
