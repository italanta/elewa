import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, filter, map } from 'rxjs';
import { SubSink } from 'subsink';
import { BaseChannel, WhatsappChannel } from '@app/model/bot/channel';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { ActiveOrgStore } from '@app/state/organisation';
import { ManageChannelStoryLinkService } from '../../providers/manage-channel-story-link.service';
import { __DECODE, __ENCODE } from '@app/elements/base/security-config';

@Component({
  selector: 'conv-add-bot-to-channel',
  templateUrl: 'add-bot-to-channel.modal.html',
  styleUrls: ['./add-bot-to-channel.modal.scss']
})

//Form to register bot/story to particular channel e.g WhatsApp/Telegram
export class AddBotToChannelModal implements OnInit, OnDestroy {
  
  private _sBs = new SubSink();
  private _activeStoryId: string;
  private _orgId: string;
  
  addToChannelForm:FormGroup;

  channels:BaseChannel[] = [{ channelName: Platforms.WhatsApp } as WhatsappChannel];
  isSaving: boolean;

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _manageStoryLinkService: ManageChannelStoryLinkService,
              private _activeStoryStore$$:ActiveStoryStore,
              private _activeOrgStore$$: ActiveOrgStore) 
  {
    this.addToChannelForm = this._fb.group({
      phoneNumber: [null, [Validators.required, Validators.maxLength(13), Validators.minLength(10)]],
      bussinessId: [null ,Validators.required],
      channel: [null, Validators.required],
      apiKey:[null, Validators.required]
    })
   }

  ngOnInit()
  {
    this._sBs.sink = 
        combineLatest([this._activeStoryStore$$.get(), this._activeOrgStore$$.get()])
            .pipe(filter(([story, org]) =>!!story && !!org))
            .subscribe(([activeStory, activeOrg]) =>
                {
                  this._activeStoryId = activeStory.id as string;
                  this._orgId = activeOrg.id as string;
                });
  }

  onSubmit()
  {
    this.isSaving = true;
    const phoneNumber = this.addToChannelForm.get('phoneNumber')?.value;
    const bussinessId = this.addToChannelForm.get('bussinessId')?.value;
    const channel: BaseChannel = this.addToChannelForm.get('channel')?.value;
    const rawApiKey = this.addToChannelForm.get('apiKey')?.value;

    const channelToSubmit =  {
      channelName: channel.channelName,
      businessPhoneNumber: String(phoneNumber),
      storyId: this._activeStoryId,
      orgId: this._orgId,
      businessId: String(bussinessId),
      authorizationKey: __ENCODE(rawApiKey)
    } as BaseChannel;

    const _storyExistsInChannel$ = this._storyExistsInChannel(channelToSubmit);

    this._sBs.sink = _storyExistsInChannel$.pipe(map((exists)=> {
      if(!exists){
        //If it does not exist, link it to the channel
        return this._manageStoryLinkService
                   .addStoryToChannel(channelToSubmit).subscribe();            
      } else {
        return;
      }
    })).subscribe(()=> {
      this.isSaving = false;
      this.closeDialog();
    });            
  }

  private _storyExistsInChannel(channel: BaseChannel)
  {
    return this._manageStoryLinkService
               .getSingleStoryInChannel(channel).pipe(map(channels=> !!channels.length));
  }

  closeDialog = () => this._dialog.closeAll();

  ngOnDestroy(): void {
      this._sBs.unsubscribe();
  }
}