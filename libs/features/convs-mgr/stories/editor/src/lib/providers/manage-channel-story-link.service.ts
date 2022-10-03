import { Injectable } from '@angular/core';
import { BaseChannel, ChannelOptions } from '@app/model/bot/channel';
import { DataService } from '@ngfi/angular';

@Injectable({providedIn: 'root'})

export class ManageChannelStoryLinkService {
  
  constructor(private _repoFac: DataService) { }


  public addStoryToChannel(channel: BaseChannel)
  {
    const _channelRepo = this._repoFac.getRepo<BaseChannel>(`channels/${channel.channelName}`);
    return _channelRepo.write(channel, channel.businessPhoneNumber);
  }

  
}