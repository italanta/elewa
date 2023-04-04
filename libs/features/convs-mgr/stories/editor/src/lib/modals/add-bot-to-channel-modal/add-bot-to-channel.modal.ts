import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'

import { SubSink } from 'subsink';

import { combineLatest, filter, map, switchMap, tap } from 'rxjs';

import { __DECODE_AES, __ENCODE_AES } from '@app/elements/base/security-config';

import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { ActiveOrgStore } from '@app/state/organisation';

import { WhatsAppCommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';

import { ManageChannelStoryLinkService } from '../../providers/manage-channel-story-link.service';
import { SharedService } from '../../components/shared-service';


@Component({
  selector: 'conv-add-bot-to-channel',
  templateUrl: 'add-bot-to-channel.modal.html',
  styleUrls: ['./add-bot-to-channel.modal.scss']
})

/**
 * @Description Form to register bot/story to particular channel e.g WhatsApp/Telegram
 * Component is meant to allow users to register bot to multiple channels/PlatformType
 * 
 * TODO:
 *  - Support multiple channel interfaces. Such that the form fields adjust according to the 
 *  - Properly increment 'n'
 *  - Redesign form to be a multistep form, which three steps. 
 *      e.g. 1. Choose platform, 2. Enter information (platform specific fields) i.e. business account id 3. Choose language and publish
 *  - On platform specific fields, it will be nice to have a question mark(?) icon next to it that links to the official documentation
 */

export class AddBotToChannelModal implements OnInit, OnDestroy 
{

  private _sBs = new SubSink();
  private _activeStoryId: string;
  private _orgId: string;

  addToChannelForm: FormGroup;

  channels: CommunicationChannel[] = [{type: PlatformType.WhatsApp} as WhatsAppCommunicationChannel];

  languages: string[];
  
  isSaving: boolean;

  constructor(private _fb: FormBuilder,
    private sharedService: SharedService,
    private _dialog: MatDialog,
    private _manageStoryLinkService: ManageChannelStoryLinkService,
    private _activeStoryStore$$: ActiveStoryStore,
    private _activeOrgStore$$: ActiveOrgStore)
    {
    
  //   if (sharedService.isPublished$)
  //   {
  //     this._activeStoryStore$$.get().subscribe(data => 
  //     {  
  //   this.addToChannelForm = this._fb.group({
  //     channel: this.channels,
  //     businessPhoneNumberId: [{value: data.id, disabled: true }, [Validators.required]],
  //     channelName: [data.name, Validators.required],
  //     authenticationKey: [data.orgId, Validators.required]
  //   })
  // }
  //   )
  // }
  // else {
  //   this.addToChannelForm = this._fb.group({
  //     channel: [null],
  //     businessPhoneNumberId: [null],
  //     channelName: [null],
  //     authenticationKey: [null]
  //      messageTemplate: [null],
  //      templateVariables: [null]
  //   });
    
  
  // }
  if (sharedService.isPublished$) { 
    this._activeStoryStore$$.get().subscribe(data => { 
      this.addToChannelForm = this._fb.group({
        channel: this.channels,
        businessPhoneNumberId: [data.id],
        channelName: [data.name],
        authenticationKey: [data.orgId]
      });
      this.addToChannelForm.get('businessPhoneNumberId')?.disable();
    });
  } else {
    this.addToChannelForm.setValue({
      channel: this.channels,
      businessPhoneNumberId: null,
      channelName: null,
      authenticationKey: null
    });
  }
  
  

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
    const phoneNumberId = this.addToChannelForm.get('businessPhoneNumberId')?.value;
    var authKey = this.addToChannelForm.get('authenticationKey')?.value;
    const businessName = this.addToChannelForm.get('channelName')?.value;

    authKey = __ENCODE_AES(authKey);

    const channelToSubmit = {
      id: phoneNumberId,
      name: businessName,
      orgId:this._orgId,
      defaultStory: this._activeStoryId,
      n: 1, 
      accessToken: authKey
    } as WhatsAppCommunicationChannel;

    // TODO: @CHESA =======> Add cipher for channel authKey so that we can store auth key in db

    const _storyExistsInChannel$ = this._storyExistsInChannel(channelToSubmit);

    this._sBs.sink = _storyExistsInChannel$.pipe(
  // tap((exists) => {
  //   //isPublished value is set to the value of exists
  //   this.sharedService.setPublishedStatus(exists);
  // }),
  switchMap((exists) => {
    if (exists) {
      // Update the existing channel
      // return this._activeStoryStore$$.update(channelToSubmit)
      return this._manageStoryLinkService.updateChannel(channelToSubmit) 
    }
       else {
      // Create a new channel
      return this._manageStoryLinkService.addStoryToChannel(channelToSubmit).pipe(
        tap((channel) => {
          // Set isPublished to true after adding the story to the channel
          this.sharedService.setPublishedStatus(channel);
        })
      );
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