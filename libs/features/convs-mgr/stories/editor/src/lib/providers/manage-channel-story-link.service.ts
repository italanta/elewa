import { Injectable } from '@angular/core';

import { Query } from '@ngfi/firestore-qbuilder';
import { DataService, Repository } from '@ngfi/angular';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

@Injectable({providedIn: 'root'})

export class ManageChannelStoryLinkService {
  
  constructor(private _repoFac: DataService) { }

  private _getChannelRepo(channel:CommunicationChannel):Repository<CommunicationChannel>
  {
    const _channelRepo = this._repoFac.getRepo<CommunicationChannel>(`channels`);
    return _channelRepo;
  }

  public addStoryToChannel(channel: CommunicationChannel)
  {
    const _channelRepo = this._getChannelRepo(channel);
    return _channelRepo.write(channel, channel.id as string);
  }

  public getSingleStoryInChannel(channel: CommunicationChannel)
  {
    const channelRepo = this._getChannelRepo(channel);
    return channelRepo.getDocuments(new Query().where("id", "==", channel.id))
  }

  
}