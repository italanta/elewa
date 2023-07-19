import { Injectable } from '@angular/core';

import { LearnersStore } from '../store/learners.store';

@Injectable({
  providedIn: 'root',
})
export class EndUserService {
  constructor(private _enrolledLearners$$: LearnersStore) {}

  getAllLearners() {
    return this._enrolledLearners$$.get();
  }
}
