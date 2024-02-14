import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';



@Component({
  selector: 'italanta-apps-connect-to-channel-modal',
  templateUrl: './connect-to-channel-modal.component.html',
  styleUrls: ['./connect-to-channel-modal.component.scss'],
})



export class ConnectToChannelModalComponent {
  @Output() platformAndBotSelected = new EventEmitter<{selectedPlatform: PlatformType, botId: string}>();

  channels:CommunicationChannel[];
  selectedPlatform: PlatformType;
  channelForm:FormGroup;
  selectedChannelId:string;
  whatsappValue: PlatformType = PlatformType.WhatsApp;
  messengerValue: PlatformType = PlatformType.Messenger;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private fb: FormBuilder,
    private _dialog: MatDialog
    ){}



  onPlatformSelected(){
    this.platformAndBotSelected.emit({selectedPlatform: this.selectedPlatform, botId: this.data});
  }

   
   closeDialog(){
    this._dialog.closeAll();
   }
}
