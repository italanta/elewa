import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';

import { BotsStateService } from '@app/state/convs-mgr/bots';

@Injectable({
  providedIn: 'root',
})
export class BotResolverService implements Resolve<Bot> {
  constructor(private _botsService: BotsStateService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Bot> {
    const id = route.params['id'];
    return this._botsService.getBotById(id) as Observable<Bot>;
  };
}
