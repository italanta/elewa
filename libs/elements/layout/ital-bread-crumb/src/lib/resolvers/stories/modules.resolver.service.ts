import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { BotModulesStateService } from '@app/state/convs-mgr/modules';

@Injectable({
  providedIn: 'root',
})
export class BotModuleResolverService implements Resolve<BotModule> {
  constructor(private _botModulesService: BotModulesStateService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<BotModule> {
    const id = route.params['id'];
    return this._botModulesService.getBotModuleById(id) as Observable<BotModule>;
  };
}
