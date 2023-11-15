import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
    @Inject(MAT_DIALOG_DATA) private data: { selectedPlatform: PlatformType, initialValues: CommunicationChannel , update : boolean}
  ){  }
  ngOnInit(): void {
    this.showForm();
  }

  showForm() {
    if (this.data && this.data.selectedPlatform) {
      this.selectedPlatform = this.data.selectedPlatform;
      this.showWhatsAppForm = this.selectedPlatform === PlatformType.WhatsApp;
      this.getActiveOrg();
    }
  }

  getActiveOrg() {
    this._sbS.sink = this._orgService$$.getActiveOrg().subscribe((org) => {
      this.activeOrg = org;
      this.initForm();
    });
  }

  initForm() {
    const orgId = this.activeOrg?.id as string; 
  
    if (this.selectedPlatform === PlatformType.WhatsApp) {
      this.channelForm = _channelWhatsAppForm(this.fb, orgId);
    } else {
      this.channelForm = _channelMessengerForm(this.fb, orgId);
    }

     // Populate the form with initial values if available
    const initialValues = this.data.initialValues || {};
    this.channelForm.patchValue(initialValues);
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

  ngOnDestroy()
  {
    this._sbS.unsubscribe();
  }
}
