import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Observable, of } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

@Injectable({
  providedIn: 'root',
})
export class BotResolverService implements Resolve<Bot> {
  private fetchedBots$: Observable<Bot[]>;

  constructor(private _botsService: BotsStateService) {
    this.fetchedBots$ = this._botsService.getBots().pipe(take(1)); 

    //since this is provided in root and we call it in the constructor, The original bots are thus fetched once.
    //why? Trying to optimise this as we use the resolver in multiple routes and also the user will navigate to and from diff routes multiple times.
  }

  resolve(route: ActivatedRouteSnapshot): Observable<Bot> {
    const id = route.params['id'];

    return this.fetchedBots$.pipe(
      switchMap((bots) => {
        const existingBot = bots.find((bot) => bot.id === id);

        if (existingBot) {
          return of(existingBot);
        } else {
          return (this._botsService.getBotById(id) as Observable<Bot>).pipe(
            filter((bot) => !!bot),
            take(1)
          );
        }
      })
    );
  }
}
