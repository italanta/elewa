import { v4 as uuid } from 'uuid';

import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { DialogflowCXIntent, Fallback } from '@app/model/convs-mgr/fallbacks';

import { FallbackStore } from '../store/fallback.store';

@Injectable({
  providedIn: 'root',
})
export class FallbackService {
  constructor(private _fallback$$: FallbackStore, private _aff:  AngularFireFunctions) {}

  getAllFallbacks() {
    return this._fallback$$.get();
  }

  addFallback(fallback: Fallback) {

    const uniqId = uuid().slice(0,5);
    const intentId = `${fallback.actionsType}_${uniqId}`;
    const trainingPhrases = fallback.userInput.map((input)=> ({ text: input}));

    const dialogFlowIntent: DialogflowCXIntent = {
      name: intentId,
      displayName: fallback.actionDetails.description,
      trainingPhrases: trainingPhrases,
      orgId: fallback.orgId,
      botId: fallback.botId
    }

    return this._aff.httpsCallable('createIntent')(dialogFlowIntent);
  }

  getSpecificFallback(id: string) {
    return this._fallback$$.getOne(id);
  }

  deleteFallback(fallback: Fallback) {
    return this._fallback$$.remove(fallback);
  }

  updateFallback(fallback: Fallback) {
    const uniqId = uuid().slice(0,5);
    const intentId = `${fallback.actionsType}_${uniqId}`;
    const trainingPhrases = fallback.userInput.map((input)=> ({ text: input}));

    const dialogFlowIntent: DialogflowCXIntent = {
      name: intentId,
      displayName: fallback.actionDetails.description,
      trainingPhrases: trainingPhrases,
      orgId: fallback.orgId,
      botId: fallback.botId
    }

    return this._aff.httpsCallable('updateIntent')(dialogFlowIntent);
  }
}
