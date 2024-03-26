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

  @Input() channelData : { selectedPlatform: PlatformType, channel: CommunicationChannel };

  selectedPlatform: PlatformType;
  showWhatsAppForm :boolean;
 
  channelForm: FormGroup;
  
  activeOrg: Organisation;

  private _sbS = new SubSink();

  constructor(
    private _channelService$: CommunicationChannelService,
    private _dialog: MatDialog,
    private fb: FormBuilder,
    private _orgService$$: OrganisationService,
  ){  }
  ngOnInit(): void {
    this.showForm();
    this.initForm();
    this.getActiveOrg();
  }

  showForm() {
    if (this.channelData && this.channelData.selectedPlatform) {
      this.selectedPlatform = this.channelData.selectedPlatform;
      this.showWhatsAppForm = this.selectedPlatform === PlatformType.WhatsApp;
    }
  }

  getActiveOrg() {
    this._sbS.sink = this._orgService$$.getActiveOrg().subscribe((org) => {
      this.activeOrg = org;
    });
  }

  initForm() {
    const orgId = this.activeOrg?.id as string; 
  
    if (this.selectedPlatform === PlatformType.WhatsApp) {
      this.channelForm = _channelWhatsAppForm(this.fb, orgId);
    } else {
      this.channelForm = _channelMessengerForm(this.fb, orgId);
    }

    if(this.channelData) {
      // Populate the form with initial values if available
     const initialValues = this.channelData.channel || {};
     this.channelForm.patchValue(initialValues);
    }
  }

  
  onChannelFormSubmit() {
    if (!this.channelForm.valid) {
      return;
    }
  
    // Set id based on the selected platform
    const idKey = this.showWhatsAppForm ? 'phoneNumberId' : 'pageId';
    this.channelForm.patchValue({
      id: this.channelForm.get(idKey)?.value,
    });
  
  
    const channelData = this.channelForm.value;
  
    // Check if it's an update or new channel
    const channelObservable = this.channelData.channel ?
      this._channelService$.updateChannel(channelData) :
      this._channelService$.addChannels(channelData, this.channelForm.get('id')?.value);
  
    channelObservable.subscribe(() => {
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
