import { Injectable } from '@angular/core';

import { ChannelsStore } from '../store/channel.store';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(
    private _channels$$: ChannelsStore,
    ) {}
  
  /**
   * fn: getAllChannels
   * @returns all channels regardless of organisation.
   */
  getAllChannels() {
    return this._channels$$.get();
  }

  /**
   * fn: getChannelByOrg
   * @returns all the channels owned by an  organisation.
   */
  getChannelByOrg() {
    return this._channels$$.getChannelsByOrg();
  }
  
}
