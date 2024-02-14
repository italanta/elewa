import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';

import { BotsStore } from '../stores/bots.store';

@Injectable({
  providedIn: 'root',
})
export class BotsStateService {
  constructor(private _botsStore$$: BotsStore) {}

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

  deleteBot(bot: Bot): Observable<Bot> {
    return this._botsStore$$.remove(bot);
  }

  archiveBot(bot: Bot)
  {
    bot.isArchived = true;
    return this.updateBot(bot);
  }

  publishBot(bot: Bot)
  {
    bot.isPublished = true;
    return this.updateBot(bot);
  }

}
