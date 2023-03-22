import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';
import { Store } from '@iote/state';

import { DataService, Repository } from '@ngfi/angular';

import { ChatJumpPoint } from '@app/model/convs-mgr/conversations/chats';

@Injectable({
  providedIn: 'root'
})
export class ChatJumpPointsStore extends Store<ChatJumpPoint[]>
{
  protected store = 'chat-jump-points-store';
  protected _activeRepo: Repository<any>;

   // Question to dev's reviewing:
    //   Will this always get all the chats?
    //     i.e. Even if no properties need to be loaded for a specific piece of functionaly e.g. invites, do we still load all properties?
    //
    // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_dataProvider: DataService,
              protected _logger: Logger)
  {
    super([]);

    this._activeRepo = _dataProvider.getRepo<any>('config');

    const data$ = this._activeRepo.getDocumentById('chat-jumps/');

    this._sbS.sink = data$.subscribe(chatJumps => {
      this.set(chatJumps, 'UPDATE - FROM DB');
    });
  }

  override get = () => super.get().pipe(map(config => Object.values(config) as ChatJumpPoint[]));
  
}
