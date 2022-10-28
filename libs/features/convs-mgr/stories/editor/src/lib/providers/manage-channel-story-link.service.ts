import { Injectable } from '@angular/core';
import { Query } from '@ngfi/firestore-qbuilder';
import { CommunicationChannel } from '@app/model/bot/channel';
import { DataService, Repository } from '@ngfi/angular';

@Injectable({providedIn: 'root'})

export class ManageChannelStoryLinkService {
  
  constructor(private _repoFac: DataService) { }

  private _getChannelRepo(channel:CommunicationChannel):Repository<CommunicationChannel>
  {
    const _channelRepo = this._repoFac.getRepo<CommunicationChannel>(`channels/${channel.channelName}/accounts/${channel.businessAccountId}/bots`);
    return _channelRepo;
  }

  public addStoryToChannel(channel: CommunicationChannel)
  {
    const _channelRepo = this._getChannelRepo(channel);
    return _channelRepo.write(channel, channel.businessPhoneNumberId as string);
  }

  public getSingleStoryInChannel(channel: CommunicationChannel)
  {
    const channelRepo = this._getChannelRepo(channel);
    return channelRepo.getDocuments(new Query().where("businessPhoneNumberId", "==", channel.businessPhoneNumberId))
  }

  
}