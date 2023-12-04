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

  generateAvatar(): string {
    const name = this.currentLearner.name?.trim() ?? '';

    if (name === '') {
      return '';
    }

    // Split the name into words
    const words = name.split(' ');

    // Take the first letter of the first two words and capitalize them
    const initials = words
      .slice(0, 2) // Take the first two words
      .map(word => word.charAt(0).toUpperCase()) // Take the first letter of each word and capitalize it
      .join(''); // Join the results into a single string

    return initials;
  }

  getAvatar() :string{
    return this.generateAvatar();
  }

  getStatus() :string{
    return EnrolledEndUserStatus[this.currentLearner.status];
  }

  goToChat() :void{
    this._router.navigate(['chats', this.currentLearner.whatsappUserId])
  }
}
