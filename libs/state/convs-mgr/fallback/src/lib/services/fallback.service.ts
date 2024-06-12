import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { BehaviorSubject, switchMap } from 'rxjs';

import { Fallback } from '@app/model/convs-mgr/fallbacks';
import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { FallbackStore } from '../store/fallback.store';

@Injectable({
  providedIn: 'root',
})
export class FallbackService {
  private bot$ = new BehaviorSubject<Bot>({} as any);
  selectedBot$ = this.bot$.asObservable();
  
  constructor(private _fallback$$: FallbackStore, private _botService: BotsStateService, private _router: Router, private _aff:  AngularFireFunctions) {}

  setBot(bot: Bot) {
    this.bot$.next(bot);
  }

  getSelectedBot() {
   return this.selectedBot$.pipe(switchMap((bot)=> {
    if(Object.keys(bot).length !== 0) {
      return this.selectedBot$;
    } else {
      const botId = this._router.url.split('/')[2];

      return this._botService.getBotById(botId);
    }
   }))
  }

  getAllFallbacks() {
    return this._fallback$$.get();
  }

  addFallback(fallback: Fallback) {

    return this._aff.httpsCallable('createIntent')(fallback);
  }

  getSpecificFallback(id: string) {
    return this._fallback$$.getOne(id);
  }

  deleteFallback(fallback: Fallback) {
    return this._fallback$$.remove(fallback);
  }

  updateFallback(fallback: Fallback) {
    return this._aff.httpsCallable('updateIntent')(fallback);
  }
}
