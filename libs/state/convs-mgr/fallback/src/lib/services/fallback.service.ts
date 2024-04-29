import { Injectable } from '@angular/core';

import { Fallback } from '@app/model/convs-mgr/fallbacks';

import { FallbackStore } from '../store/fallback.store';

@Injectable({
  providedIn: 'root',
})
export class FallbackService {
  constructor(private _fallback$$: FallbackStore) {}

  getAllFallbacks() {
    return this._fallback$$.get();
  }

  addFallback(fallback: Fallback) {
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
