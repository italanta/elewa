import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Organisation } from '@app/model/organisation';
import { OrganisationService } from '@app/private/state/organisation/main';
import { PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { _channelMessengerForm, _channelWhatsAppForm } from '../../providers/channels-forms';



@Component({
  selector: 'app-channel-form-modal',
  templateUrl: './channel-form-modal.component.html',
  styleUrls: ['./channel-form-modal.component.scss'],
})
export class ChannelFormModalComponent implements OnInit, OnDestroy {

  @Input() set channelData(data: { selectedPlatform: PlatformType, channel: CommunicationChannel })
  {
    if (data && data.selectedPlatform) {
      this.selectedPlatform = data.selectedPlatform;
      
      this.initForm();
    }
    
    if(data && data.channel) {
      this.channel = data.channel;
      this.initForm();
    }

  }
  selectedPlatform: PlatformType;

  channel: CommunicationChannel;
 
  channelForm: FormGroup;
  
  activeOrg: Organisation;

  private _sbS = new SubSink();

  constructor(
    private _channelService$: CommunicationChannelService,
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _orgService$$: OrganisationService,
  ) { }

  ngOnInit(): void {
    this.getActiveOrg();
  }

  getActiveOrg() {
    this._sbS.sink = this._orgService$$.getActiveOrg().subscribe((org) => {
      this.activeOrg = org;
      if(this.channelForm) {
        this.setOrgId(this.activeOrg.id as string);
      }
    });
  }

  initForm() { 
    if(!this.selectedPlatform) return;
    if (this.selectedPlatform === PlatformType.WhatsApp) {
      this.channelForm = _channelWhatsAppForm(this.fb);
    } else {
      this.channelForm = _channelMessengerForm(this.fb);
    }
    if(this.channel) {
     this.channelForm.patchValue(this.channel);
    }
  }

  setOrgId(orgId: string) {

    this.channelForm.patchValue({
      orgId: orgId,
    });

  }

  
  onChannelFormSubmit() {
    if (!this.channelForm.valid) {
      return;
    }
    let idKey;

    // Set id based on the selected platform
    switch (this.selectedPlatform) {
      case PlatformType.WhatsApp:
        idKey = 'phoneNumberId';
        break;
      case PlatformType.Messenger:
        idKey = 'pageId';
        break;
      default:
        idKey = 'phoneNumberId';
        break;
    }

    this.channelForm.patchValue({
      id: this.channelForm.get(idKey)?.value,
    });
  
  
    const channelData = this.channelForm.value;
    channelData.orgId = this.activeOrg.id as string;

    let channel$;
    // Check if it's an update or new channel
    if(this.channel) {
      channelData.id = this.channel.id;
      channel$ = this._channelService$.updateChannel(channelData);
    } else {
      channel$ =this._channelService$.addChannels(channelData, this.channelForm.get('id')?.value);
    }
  
    channel$.subscribe(() => {
      this.closeModal();
    });
  }
  

  closeModal() {
    this._dialog.closeAll();
  }

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
