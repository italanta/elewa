import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { BehaviorSubject, switchMap } from 'rxjs';

import { FallBackActionTypes, Fallback, RouteAction } from '@app/model/convs-mgr/fallbacks';
import { Bot } from '@app/model/convs-mgr/bots';
import { BotsStateService } from '@app/state/convs-mgr/bots';

import { FallbackStore } from '../store/fallback.store';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { ActiveOrgStore } from '@app/private/state/organisation/main';

@Injectable({
  providedIn: 'root',
})
export class FallbackService {
  private bot$ = new BehaviorSubject<Bot>({} as any);
  selectedBot$ = this.bot$.asObservable();
  
  constructor(private _fallback$$: FallbackStore, private _blockService: StoryBlocksStore, private _activeOrgStore$$: ActiveOrgStore, private _botService: BotsStateService, private _router: Router, private _aff:  AngularFireFunctions) {}

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
    return this._aff.httpsCallable('deleteIntent')(fallback);
  }

  updateFallback(fallback: Fallback) {

    if(fallback.actionsType === FallBackActionTypes.Route) {
      const routeAction = fallback.actionDetails as RouteAction;
      const storyId = routeAction.storyId;
      const org$ = this._activeOrgStore$$.get();
      
        return org$.pipe(switchMap((org)=> this._blockService.getBlocksByStory(storyId, org.id)))
          .pipe(switchMap((blocks)=> {
            const block = blocks.filter((b)=> b.id === (fallback.actionDetails as RouteAction).blockId);

            routeAction.block = block[0];

            fallback.actionDetails = routeAction;

            return this._aff.httpsCallable('editIntent')(fallback);
          }));

    } else {
      return this._aff.httpsCallable('editIntent')(fallback);
    }

    
  }
}
