import { User } from "./user.interface";
import { Roles } from "./roles.interface";
import { UserProfile } from "./user-profile.interface";

export class UserModel implements User {
  
  uid: string;
  email: string;
  
  roles: Roles;

  photoUrl?: string;
  displayName?: string;

  profile: UserProfile;

  constructor(userData: any) {
    this.uid = userData.uid;
    this.email = userData.email;

    this.roles = { access: false };

    this.photoUrl = userData.photoUrl;
    this.displayName = userData.displayName;

    this.profile = {};
  }  

}
