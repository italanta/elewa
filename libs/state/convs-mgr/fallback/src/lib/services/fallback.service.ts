import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { Fallback } from '@app/model/convs-mgr/fallbacks';

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
    this._aff.httpsCallable('createIntent');
    return this._fallback$$.add(fallback);
  }

  getSpecificFallback(id: string) {
    return this._fallback$$.getOne(id);
  }

  deleteFallback(fallback: Fallback) {
    return this._fallback$$.remove(fallback);
  }

  updateFallback(fallback: Fallback) {
    return this._fallback$$.update(fallback);
  }
}
