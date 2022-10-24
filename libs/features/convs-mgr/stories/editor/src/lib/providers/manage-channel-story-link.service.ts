import { Injectable } from '@angular/core';
import { Query } from '@ngfi/firestore-qbuilder';
import { BaseChannel } from '@app/model/bot/channel';
import { DataService, Repository } from '@ngfi/angular';

@Injectable({providedIn: 'root'})

export class ManageChannelStoryLinkService {
  
  constructor(private _repoFac: DataService) { }

  private _getChannelRepo(channel:BaseChannel):Repository<BaseChannel>
  {
    const _channelRepo = this._repoFac.getRepo<BaseChannel>(`channels/${channel.channelName}/accounts`);
    return _channelRepo;
  }

  public addStoryToChannel(channel: BaseChannel)
  {
    const _channelRepo = this._getChannelRepo(channel);
    return _channelRepo.write(channel, channel.businessAccountId as string);
  }

  public getSingleStoryInChannel(channel: BaseChannel)
  {
    const channelRepo = this._getChannelRepo(channel);
    return channelRepo.getDocuments(new Query().where("businessAccountId", "==", channel.businessAccountId))
  }

  
}