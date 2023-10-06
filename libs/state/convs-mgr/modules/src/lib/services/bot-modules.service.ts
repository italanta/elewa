import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { BotModulesStore } from '../stores/bot-module.stores';

@Injectable({
  providedIn: 'root',
})
export class BotModulesStateService {
  constructor(private _botModuleStore$$: BotModulesStore) {}

  getBotModules(): Observable<BotModule[]> {
    return this._botModuleStore$$.get();
  }

  getBotModulesFromParentBot(botId: string): Observable<BotModule[]> {
    return this._botModuleStore$$.get().pipe(
      map(mods => mods.filter(mod => mod.parentBot === botId))
    );
  }

  getBotModuleById(id: string): Observable<BotModule | undefined> {
    return this._botModuleStore$$.getOne(id);
  }

  createBotModules(botModule: BotModule): Observable<BotModule> {
    return this._botModuleStore$$.add(botModule);
  }

  updateBotModules(botModule: BotModule): Observable<BotModule> {
    return this._botModuleStore$$.update(botModule);
  }

  deleteBotModules(botModule: BotModule): Observable<BotModule> {
    return this._botModuleStore$$.remove(botModule);
  }
}
