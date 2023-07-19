import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';

@Component({
  selector: 'app-learners-page',
  templateUrl: './learners-page.component.html',
  styleUrls: ['./learners-page.component.scss'],
})
export class LearnersPageComponent implements OnInit {
  constructor(private _eLearners:EnrolledLearnersService){}

  allLearners$:Observable<EnrolledEndUser[]>;

  ngOnInit() {
    this.allLearners$ = this._eLearners.getAllLearners()
  }
}
