
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';


@Component({
  selector: 'app-select-channel-modal',
  templateUrl: './select-channel-modal.component.html',
  styleUrls: ['./select-channel-modal.component.scss'],
})
export class SelectChannelModalComponent {
  @Output() selectedPlatformOutput = new EventEmitter<{ selectedPlatform: PlatformType; }>();

  channels: CommunicationChannel[];
  selectedPlatform: PlatformType;
  channelForm: FormGroup;
  selectedChannelId: string;
  whatsappValue: PlatformType = PlatformType.WhatsApp;
  messengerValue: PlatformType = PlatformType.Messenger;
  platformNotSelected: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _dialog: MatDialog
  ) { }

  onPlatformSelected()
  {
    if(this.selectedPlatform){
      this.selectedPlatformOutput.emit({ selectedPlatform: this.selectedPlatform});
    }
    else{
      this.platformNotSelected = true;
    }
  }

  closeDialog()
  {
    this._dialog.closeAll();
  }
}

