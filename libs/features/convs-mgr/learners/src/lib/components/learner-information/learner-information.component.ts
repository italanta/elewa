import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-learner-information',
  templateUrl: './learner-information.component.html',
  styleUrls: ['./learner-information.component.scss'],
})
export class LearnerInformationComponent {
  constructor( private _router: Router){}
  @Input() currentLearner: EnrolledEndUser;
  getStatus(status: number) {
    return (
      EnrolledEndUserStatus[status].charAt(0).toUpperCase() +
      EnrolledEndUserStatus[status].slice(1)
    );
  }
  goToChat(user: EnrolledEndUser){
    this._router.navigate(['chats', user.id])
  }
}
