import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';

import { BotsStore } from '../stores/bots.store';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable({
  providedIn: 'root',
})
export class BotsStateService {
  constructor(private _activeOrg: ActiveOrgStore,
              private _botsStore$$: BotsStore, 
              private _aff$: AngularFireFunctions) {}

  getBots(): Observable<Bot[]> {
    return this._botsStore$$.get();
  }

  getBotById(id: string): Observable<Bot | undefined> {
    return this._botsStore$$.getOne(id);
  }

  createBot(bot: Bot): Observable<Bot> {
    return this._botsStore$$.add(bot);
  }

  updateBot(bot: Bot): Observable<Bot> {
    return this._botsStore$$.update(bot);
  }

  deleteBot(bot: Bot): Observable<any> {
    return this._activeOrg.get()
          .pipe(switchMap((org)=> this._aff$.httpsCallable('deleteBot')({orgId: org.id, botId: bot.id})));
    
  }

  archiveBot(bot: Bot)
  {
    bot.isArchived = true;
    return this.updateBot(bot);
  }

  publishBot(bot: Bot)
  {
    bot.isPublished = true;
    bot.publishedOn = new Date();
    
    return this.updateBot(bot);
  }

}
