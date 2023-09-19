import { Injectable } from '@angular/core';

import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Connection } from '@app/model/convs-mgr/conversations/chats';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

@Injectable({
  providedIn: 'root'
})
export class CheckStoryErrorsService {

  constructor(private _aFF: AngularFireFunctions) { }

  fetchFlowErrors(connections: Connection[], blocks: StoryBlock[], storyId: string) {
    const callable = this._aFF.httpsCallable('checkStoryErrors');
    return callable({connections, blocks, storyId});
  }
}
