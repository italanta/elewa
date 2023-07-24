import { Injectable } from '@angular/core';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';

import { LearnersStore } from '../store/learners.store';

@Injectable({
  providedIn: 'root',
})
export class EnrolledLearnersService {
  constructor(private _enrolledLearners$$: LearnersStore) {}

  getAllLearners$() {
    return this._enrolledLearners$$.get();
  }

  addLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.add(learner);
  }

  removeLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.remove(learner);
  }

  updateLearner$(learner: EnrolledEndUser) {
    return this._enrolledLearners$$.update(learner);
  }
}
