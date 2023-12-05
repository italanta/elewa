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

  // Get initials of the learner's name for the avatar
  getInitials(): string {
    const name = this.currentLearner.name || '';
    const nameParts = name.split(' ');
  
    if (nameParts.length >= 2) {
      // Use the first letter of the first name and the first letter of the last name
      const firstNameInitial = nameParts[0].charAt(0);
      const lastNameInitial = nameParts[nameParts.length - 1].charAt(0);
  
      return (firstNameInitial + lastNameInitial).toUpperCase();
    } else if (nameParts.length === 1) {
      // If there's only one name, use the first two letters of that name
      return nameParts[0].slice(0, 2).toUpperCase();
    } else {
      // Return an empty string if the name is empty
      return '';
    }
  }

  // Format the phone number in the desired pattern(4-3-3)
  formatPhoneNumber(phoneNumber: string | undefined): string {
    if (!phoneNumber) {
      return ''; 
    }
    return phoneNumber.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
}
