import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { GET_RANDOM_COLOR, GET_USER_AVATAR } from 'libs/features/convs-mgr/conversations/chats/src/lib/providers/avatar.provider';

@Component({
  selector: 'app-learner-information',
  templateUrl: './learner-information.component.html',
  styleUrls: ['./learner-information.component.scss'],
})
export class LearnerInformationComponent {
  location = ""
  constructor( private _router: Router){}

  @Input() currentLearner: EnrolledEndUser;

  // Generate a random color for the avatar
  randomAvatarColor = () => GET_RANDOM_COLOR(); 

  getStatus() :string{
    return EnrolledEndUserStatus[this.currentLearner.status];
  }

  goToChat() :void{
    this._router.navigate(['chats', this.currentLearner.whatsappUserId])
  }

  // Get initials of the learner's name for the avatar
  getInitials = (name: string) => GET_USER_AVATAR(name);

  // Format the phone number in the desired pattern(4-3-3)
  formatPhoneNumber(phoneNumber: string | undefined): string {
    if (!phoneNumber) {
      return ''; 
    }
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
}
