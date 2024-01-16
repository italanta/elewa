import { Injectable } from '@angular/core';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BotsModuleService {

  constructor(private communicationChannel$ :CommunicationChannelService) { }


  getChannels() :Observable<CommunicationChannel[]>{
    return this.communicationChannel$.getAllChannels().pipe(map(response => response));
  }

}
