import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
