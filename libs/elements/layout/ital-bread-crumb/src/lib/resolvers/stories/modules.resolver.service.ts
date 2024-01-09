import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { BotModule } from '@app/model/convs-mgr/bot-modules';

import { BotModulesStateService } from '@app/state/convs-mgr/modules';

@Injectable({
  providedIn: 'root',
})
export class BotModuleResolverService implements Resolve<BotModule> {
  private fetchedBotMods$: Observable<BotModule[]>;

  constructor(private _botModulesService: BotModulesStateService) {
    //since this is provided in root and we call it in the constructor, The original bots are thus fetched once.
    //why? Trying to optimise this as we use the resolver in multiple routes and also the user will navigate to and from diff routes multiple times.

    this.fetchedBotMods$ = this._botModulesService.getBotModules().pipe(take(1)); 
  }

  resolve(route: ActivatedRouteSnapshot): Observable<BotModule> {
    const id = route.params['id'];

    return this.fetchedBotMods$.pipe(
      switchMap((bots) => {
        const existingBot = bots.find((bot) => bot.id === id);

        if (existingBot) {
          return of(existingBot);
        } else {
          return (this._botModulesService.getBotModuleById(id) as Observable<BotModule>).pipe(
            filter((botMod) => !!botMod),
            take(1)
          );
        }
      })
    );
  };
}
