import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { CommunicationChannel, MessengerCommunicationChannel, WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { Organisation } from '@app/model/organisation';
import { OrganisationService } from '@app/private/state/organisation/main';

import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

@Component({
  selector: 'app-channel-form-modal',
  templateUrl: './channel-form-modal.component.html',
  styleUrls: ['./channel-form-modal.component.scss'],
})
export class ChannelFormModalComponent implements OnInit {

  selectedPlatform: string;
  showWhatsAppForm :boolean;
 
  channelForm: FormGroup;
  
  activeOrg: Organisation;

  constructor(
    private _channelService$: CommunicationChannelService,
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _orgService$$: OrganisationService,
    @Inject(MAT_DIALOG_DATA) private data: { selectedPlatform: string, initialValues: CommunicationChannel , update : boolean}
  ){  }
  ngOnInit(): void {
    this.showForm();
  }

  showForm() {
    if (this.data && this.data.selectedPlatform) {
      this.selectedPlatform = this.data.selectedPlatform;
      this.showWhatsAppForm = this.selectedPlatform === 'WhatsApp';
      this.getActiveOrg();
    }
  }

  getActiveOrg() {
    this._orgService$$.getActiveOrg().subscribe((org) => {
      this.activeOrg = org;
      this.initForm();
    });
  }

  initForm() {
    const initialValues = this.data.initialValues || {};
  
    // Cast initialValues to the specific interface based on the selected platform
    let specificInitialValues: WhatsAppCommunicationChannel | MessengerCommunicationChannel;
    if (this.showWhatsAppForm) {
      specificInitialValues = initialValues as WhatsAppCommunicationChannel;
    } else {
      specificInitialValues = initialValues as MessengerCommunicationChannel;
    }
  
    this.channelForm = this.fb.group({
      id:[],
      type: [this.selectedPlatform],
      name: [specificInitialValues.name || ''],
      accessToken: [specificInitialValues.accessToken || '', Validators.required],
      phoneNumber: [(specificInitialValues as WhatsAppCommunicationChannel).phoneNumber || ''],
      phoneNumberId: [(specificInitialValues as WhatsAppCommunicationChannel).phoneNumberId || ''],
      businessAccountId: [(specificInitialValues as WhatsAppCommunicationChannel).businessAccountId || ''],
      pageId: [(specificInitialValues as MessengerCommunicationChannel).pageId || ''],
      orgId: [this.activeOrg.id],
    });
  }

  
  onChannelFormSubmit() {
    if (!this.channelForm.valid) {
      return;
    }
  
    // Set id based on the selected platform
    const idKey = this.showWhatsAppForm ? 'phoneNumberId' : 'pageId';
    this.channelForm.patchValue({
      id: this.channelForm.value[idKey],
    });
  
    if (this.showWhatsAppForm) {
      this.channelForm.removeControl('pageId');
    } else {
      this.channelForm.removeControl('phoneNumber');
      this.channelForm.removeControl('phoneNumberId');
      this.channelForm.removeControl('businessAccountId');
    }
  
    const channelData = this.channelForm.value;
  
    // Check if it's an update or new channel
    const channelObservable = this.data.update ?
      this._channelService$.updateChannel(channelData) :
      this._channelService$.addChannels(channelData, this.channelForm.get('id')?.value);
  
    channelObservable.subscribe(() => {
      this.closeModal();
    });
  }
  

  closeModal() {
    this._dialog.closeAll();
  }
}
