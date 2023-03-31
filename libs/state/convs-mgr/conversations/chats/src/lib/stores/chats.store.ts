import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore }  from '@ngfi/state';

import { of } from 'rxjs'
import { tap, throttleTime, switchMap, map, mergeMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation';
import { Story } from '@app/model/convs-mgr/stories/main';

import { ActiveOrgStore } from '@app/state/organisation';
import { Chat, ChatStatus } from '@app/model/convs-mgr/conversations/chats';
import { Cursor } from '@app/model/convs-mgr/conversations/admin/system';
import { StoriesStore } from '@app/state/convs-mgr/stories';

@Injectable({
  providedIn: 'root'
})
export class ChatsStore extends DataStore<Chat>
{
  protected store = 'stories-store';
  protected _activeRepo: Repository<Chat>;

  private _activeOrg: Organisation;
  
  // Question to dev's reviewing:
  //   Will this always get all the organisations?
  //     i.e. Even if no organisations need to be loaded for a specific piece of functionaly e.g. invites, do we still load all organisations?
  //
  // Answer: No, as Angular's DI engine is lazy, meaning it will only initialise services the first time they are called.
  constructor(_org$$: ActiveOrgStore,
              private _repoFac: DataService,
              private _StoryStore$$: StoriesStore, 
              _logger: Logger)
  {
    super("always", _logger);

    const data$ = _org$$.get()
                    .pipe(
                      tap((org: Organisation) => this._activeOrg  = org),
                      tap((org: Organisation) => this._activeRepo = _repoFac.getRepo<Chat>(`orgs/${org.id}/end-users`)),
                      switchMap((org: Organisation) => 
                        org ? this._activeRepo.getDocuments() : of([] as Chat[])),
                      // update chat.name with the end-user's name

                      throttleTime(500, undefined, { leading: true, trailing: true }));

    this._sbS.sink = data$.subscribe(properties => {
      this.set(properties, 'UPDATE - FROM DB');
    });
  }


  getChatUserName(id: string) {

    const namesRepo = this._repoFac.getRepo<any>(`orgs/${this._activeOrg.id}/end-users/${id}/variables`);

    const valuesDoc$ = namesRepo.getDocumentById('values');

    return valuesDoc$;
  }  
  
  getCurrentCursor(id: string) {
    const cursorRepo = this._repoFac.getRepo<Cursor>(`orgs/${this._activeOrg.id}/end-users/${id}/cursor`);

    const latestCursor$ = cursorRepo.getLatestDocument();

    return latestCursor$;
  }

  getCurrentStory(id: string) {
    return this._StoryStore$$.getOne(id).pipe(
      map((story) => {
        console.log(story)
        return story
    }))
  }

  pauseChat(id: string) {

    const chatsRepo = this._repoFac.getRepo<Chat>(`orgs/${this._activeOrg.id}/end-users`);

    const chat = chatsRepo.getDocumentById(id);

    return chat.pipe(map((chat: Chat) => {

      if (chat.status === ChatStatus.PausedByAgent) {
        chat.status = ChatStatus.Running;
      } else {
        chat.status = ChatStatus.PausedByAgent;
      }
      return chatsRepo.update(chat)
    }));
  }
}
