import { Injectable } from '@angular/core';

import { Logger } from '@iote/bricks-angular';

import { DataStore } from '@ngfi/state';
import { Query } from '@ngfi/firestore-qbuilder';
import { DataService, Repository } from '@ngfi/angular';

import { Chat } from '@app/model/convs-mgr/conversations/chats';

@Injectable({
    providedIn: 'root'
  })
export class ChatsStore extends DataStore<Chat>
{
  protected store = 'chat-store';
  protected _activeRepo: Repository<Chat>;

   // Question to dev's reviewing:
    //   Will this always get all the chats?
    //     i.e. Even if no properties need to be loaded for a specific piece of functionaly e.g. invites, do we still load all properties?
    //
    // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_dataProvider: DataService,
              _logger: Logger)
  {
    super("always",  _logger);

    this._activeRepo = _dataProvider.getRepo<Chat>('chats');

    const data$ = this._activeRepo.getDocuments(new Query().orderBy('updatedOn', 'desc'));

    this._sbS.sink = data$.subscribe(chats => {
      this.set(chats, 'UPDATE - FROM DB');
    });
  }
}
