import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'

import { SubSink } from 'subsink';

import { combineLatest, filter, map } from 'rxjs';

import { __DECODE_AES, __ENCODE_AES } from '@app/elements/base/security-config';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { ActiveOrgStore } from '@app/state/organisation';

import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { ManageChannelStoryLinkService } from '../../providers/manage-channel-story-link.service';


@Component({
  selector: 'conv-add-bot-to-channel',
  templateUrl: 'add-bot-to-channel.modal.html',
  styleUrls: ['./add-bot-to-channel.modal.scss']
})

/**
 * @Description Form to register bot/story to particular channel e.g WhatsApp/Telegram
 * Component is meant to allow users to register bot to multiple channels/PlatformType
 */

export class AddBotToChannelModal implements OnInit, OnDestroy 
{

  private _sBs = new SubSink();
  private _activeStoryId: string;
  private _orgId: string;

  addToChannelForm: FormGroup;
  technicalRef: number = 1;

  channels: CommunicationChannel[] = [{type: PlatformType.WhatsApp} as WhatsAppCommunicationChannel];
  
  isSaving: boolean;

  constructor(private _fb: FormBuilder,
    private _dialog: MatDialog,
    private _manageStoryLinkService: ManageChannelStoryLinkService,
    private _activeStoryStore$$: ActiveStoryStore,
    private _activeOrgStore$$: ActiveOrgStore)
    {
    this.addToChannelForm = this._fb.group({
      businessPhoneNumberId: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(10)]],
      businessName: [null, Validators.required],
      authenticationKey: [null, Validators.required],
      
    })
  }

  ngOnInit() {
    this._sBs.sink =
      combineLatest([this._activeStoryStore$$.get(), this._activeOrgStore$$.get()])
        .pipe(filter(([story, org]) => !!story && !!org))
        .subscribe(([activeStory, activeOrg]) => {
          this._activeStoryId = activeStory.id as string;
          this._orgId = activeOrg.id as string;
        });

  }

  onSubmit() {
    this.isSaving = true;
    const phoneNumberId = this.addToChannelForm.get('phoneNumber')?.value;
    var authKey = this.addToChannelForm.get('authenticationKey')?.value;
    const businessName = this.addToChannelForm.get('businesName')?.value;
    this.technicalRef += 1;



    authKey = __ENCODE_AES(authKey);

    const channelToSubmit = {
      id: phoneNumberId,
      name: businessName,
      orgId:this._orgId,
      defaultStory: this._activeStoryId,
      n: this.technicalRef, 
    } as CommunicationChannel;

    // TODO: @CHESA =======> Add cipher for channel authKey so that we can store auth key in db

    const _storyExistsInChannel$ = this._storyExistsInChannel(channelToSubmit);

    this._sBs.sink = _storyExistsInChannel$.pipe(map((exists) => {
      if (!exists) {
        //If it does not exist, link it to the channel
        return this._manageStoryLinkService
          .addStoryToChannel(channelToSubmit).subscribe();
      } else {
        return;
      }
    })).subscribe(() => {
      this.isSaving = false;
      this.closeDialog();
    });
  }

  private _storyExistsInChannel(channel: CommunicationChannel) {
    return this._manageStoryLinkService.getSingleStoryInChannel(channel).pipe(map(channels => !!channels.length));
  }

  closeDialog = () => this._dialog.closeAll();

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}