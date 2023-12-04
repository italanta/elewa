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

  // Generate a random color in hex format for the avatar
  getAvatarColor(): string {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
  }  

  getStatus() :string{
    return EnrolledEndUserStatus[this.currentLearner.status];
  }

  goToChat() :void{
    this._router.navigate(['chats', this.currentLearner.whatsappUserId])
  }

  // Get initials from the first two characters of the name
  getInitials(): string {
    const name = this.currentLearner.name || '';
    return name.slice(0, 2).toUpperCase();
  }
}
