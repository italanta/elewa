import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GET_USER_AVATAR } from '@app/features/convs-mgr/conversations/chats';

import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';

@Component({
  selector: 'app-learner-information',
  templateUrl: './learner-information.component.html',
  styleUrls: ['./learner-information.component.scss'],
})
export class LearnerInformationComponent implements OnInit {
  location = ""

  learnerInitials: string;

  constructor( private _router: Router){}

  @Input() currentLearner: EnrolledEndUser;

  ngOnInit() {
    // Get initials of the learner's name for the avatar once when the component is initialized
    this.learnerInitials = this.getInitials(this.currentLearner.name);
  }

  getStatus() :string{
    return EnrolledEndUserStatus[this.currentLearner.status];
  }

  goToChat() :void{
    this._router.navigate(['chats', this.currentLearner.whatsappUserId])
  }

  // Get initials of the learner's name for the avatar
  getInitials(name: string | undefined): string {
    // Check if name is undefined before calling GET_USER_AVATAR
    return name ? GET_USER_AVATAR(name) : '';
  }

  // Format the phone number in the desired pattern(4-3-3)
  formatPhoneNumber(phoneNumber: string | undefined): string {
    if (!phoneNumber) {
      return ''; 
    }
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
}
