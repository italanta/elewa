import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { BotsModuleService } from '../../services/bots-module.service';
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


    openChannel() {
      this._dialog.open(ChannelComponent,{
        width: '30rem',
         height: '25rem',
         data: { selectedPlatform: this.selectedPlatform , botId:this.data}
      });
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
