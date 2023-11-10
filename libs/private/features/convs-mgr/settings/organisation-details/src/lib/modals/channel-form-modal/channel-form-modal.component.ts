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
    @Inject(MAT_DIALOG_DATA) private data: { selectedPlatform: string, initialValues: CommunicationChannel }
  ){  }
  ngOnInit(): void {
    this.showForm();
  }

  showForm() {
    if (this.data && this.data.selectedPlatform) {
      this.selectedPlatform = this.data.selectedPlatform;
      this.showWhatsAppForm = this.selectedPlatform === 'WhatsApp';

      // Initialize form only after obtaining the active org
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
    if (this.channelForm.valid) {
      if (this.showWhatsAppForm) {
        this.channelForm.removeControl('pageId');
      }else{
        this.channelForm.removeControl('phoneNumber');
        this.channelForm.removeControl('phoneNumberId');
        this.channelForm.removeControl('businessAccountId');
      }
      
      this._channelService$.addChannels(this.channelForm.value).subscribe(() => {
        this.closeModal();
      });
    }
  }

 


  closeModal() {
    this._dialog.closeAll();
  }
}
