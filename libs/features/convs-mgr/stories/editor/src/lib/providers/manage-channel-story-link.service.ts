import { Injectable } from '@angular/core';
import { Query } from '@ngfi/firestore-qbuilder';
import { map, switchMap } from 'rxjs/operators';
import { BaseChannel } from '@app/model/bot/channel';
import { DataService, Repository } from '@ngfi/angular';

@Injectable({providedIn: 'root'})

/**
 * [class]: ManageChannelStoryLinkService
 * @Description service to add link platform/channel e.g whatsapp, telegram to a story/bot created 
 */
export class ManageChannelStoryLinkService {
  
  constructor(private _repoFac: DataService) { }

  /**
   * @Description Gets the collection of a channel which contains all stories registered to the channel
   * @param channel e.g whatsapp, telegram which are used
   */
  private _getChannelRepo(channel:BaseChannel):Repository<BaseChannel>
  {
    const _channelRepo = this._repoFac.getRepo<BaseChannel>(`channels/${channel.channelName}/${channel.storyId}`);
    return _channelRepo;
  }

  /**
   * @Description Adds a particular story/bot to a channel e.g whatsapp/telegram where it will be used by end users
   * @param channel where bot will be added e.g whatsapp/telegram 
   */
  public addStoryToChannel(channel: BaseChannel)
  {
    const _channelRepo = this._getChannelRepo(channel);
    return this._storyExistsInChannel(channel).pipe(switchMap((exists) => {
      if(exists){
        throw new Error("Channel already exists");
      }
      return _channelRepo.write(channel, channel.businessPhoneNumber);
    }));
  }

  /**
   * @Description Gets single story from repository of channels
   */
  public getSingleStoryInChannel(channel: BaseChannel)
  {
    const channelRepo = this._getChannelRepo(channel);
    return channelRepo.getDocuments(new Query().where("businessPhoneNumber", "==", channel.businessPhoneNumber))
  }

  /**
   * @Description Used to check if story/bot has already been registered to a platform/channel e.g whatsapp, telegram
   * @param channel 
   * @returns boolean
   */
  private _storyExistsInChannel(channel: BaseChannel)
  {
    return this.getSingleStoryInChannel(channel).pipe(map(channels=> !!channels.length));
  }

}