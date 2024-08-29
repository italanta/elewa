import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Observable, map, switchMap } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

import { BotModulesStore } from '../stores/bot-module.stores';

@Injectable({
  providedIn: 'root',
})
export class BotModulesStateService {
  constructor(private _botModuleStore$$: BotModulesStore,     
              private _activeOrg: ActiveOrgStore,
              private _aff$: AngularFireFunctions) {}

  getBotModules(): Observable<BotModule[]> {
    return this._botModuleStore$$.get();
  }

  getMultipleBotModules(moduleIds: string[]): Observable<BotModule[]>{
    return this._botModuleStore$$.getMany(moduleIds);
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

  deleteBotModules(botModule: BotModule): Observable<any> {
    return this._activeOrg.get()
    .pipe(switchMap((org)=> this._aff$.httpsCallable('deleteModule')({orgId: org.id, moduleId: botModule.id})));
  }
}
