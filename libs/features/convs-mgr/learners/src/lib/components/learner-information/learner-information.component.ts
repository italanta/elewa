import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-learner-information',
  templateUrl: './learner-information.component.html',
  styleUrls: ['./learner-information.component.scss'],
})
export class LearnerInformationComponent {
  location = ""
  constructor( private _router: Router){}

  @Input() currentLearner: EnrolledEndUser;

  getAvatar() :string{
    return this.currentLearner.name?.toUpperCase() ?? '';
  }

  getStatus() :string{
    return EnrolledEndUserStatus[this.currentLearner.status];
  }

  goToChat() :void{
    this._router.navigate(['chats', this.currentLearner.whatsappUserId])
  }
}
