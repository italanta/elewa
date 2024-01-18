import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';


@Injectable({
  providedIn: 'root'
})
export class BotsModuleService {

  constructor(private communicationChannel$ :CommunicationChannelService,private _botServ$: BotsStateService ) { }


  getChannels() :Observable<CommunicationChannel[]>{
    return this.communicationChannel$.getAllChannels().pipe(map(response => response));
  }
  getSpecificBot(id:string) :Observable<Bot| undefined>{
    return this._botServ$.getBotById(id)
  }

  getWhatsAppChannels():Observable<CommunicationChannel[]>{
    return this.communicationChannel$.getAllChannels().pipe(
      map((channels) => channels.filter(channel => channel.type === 'whatsapp'))
    );
  }
  getMessengerChannels():Observable<CommunicationChannel[]>{
    return this.communicationChannel$.getAllChannels().pipe(
      map((channels) => channels.filter(channel => channel.type === 'messenger'))
    );
  }

  updateChannel(channel: CommunicationChannel):Observable<CommunicationChannel>{
    return this.communicationChannel$.updateChannel(channel)
  }

  deleteBot(bot:Bot){
    this._botServ$.deleteBot(bot)
  }

  archiveBot(bot:Bot){
    this._botServ$.updateBot(bot)
  }

  publishBot(bot:Bot):Observable<Bot>{
    return this._botServ$.updateBot(bot)
  }

}
