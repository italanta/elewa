import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

import { ChannelsStore } from '../store/channel.store';

@Injectable({
  providedIn: 'root',
})
export class CommunicationChannelService {
  constructor(private _channels$$: ChannelsStore) {}

  getAllChannels() {
    return this._channels$$.get();
  }

  addChannels(channel: CommunicationChannel) {
    return this._channels$$.add(channel);
  }

  getSpecificChannel(id: string) {
    return this._channels$$.getOne(id);
  }

  deleteChannel(channel: CommunicationChannel) {
    return this._channels$$.remove(channel);
  }

  updateChannel(channel: CommunicationChannel) {
    return this._channels$$.update(channel);
  }

  getChannelByNumber(n: number){
    return this._channels$$.get().pipe(
      map(channels => channels.filter(channel => channel.n === n))
    );
  }
}
