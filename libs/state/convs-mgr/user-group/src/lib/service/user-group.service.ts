  import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { Injectable } from '@angular/core';
import { UserGroups } from '@app/model/convs-mgr/user-groups';
import { UserGroupStore } from '../store/user-group.store';
import { Observable } from 'rxjs';
import { group } from 'console';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {
  constructor(private _userGroups$$: UserGroupStore){}

  getAllUserGroups(){
    return this._userGroups$$.get();
  }
  getUserGroup$(id:string): Observable<UserGroups | undefined>{
    return this._userGroups$$.getOne(id);
  }

  deleteUserGroups$(userGroup: UserGroups) {
    this._userGroups$$.remove(userGroup); 
  }

  addUserGroups(userGroup:UserGroups){
  return this._userGroups$$.add(userGroup)
  }

  addUsersToGroup(users: EnrolledEndUser[], groupId: string): void {
    this.getUserGroup$(groupId).subscribe((group: UserGroups | undefined) => {
      if (group && group.users) {
        group.users.push(...users);
        this._userGroups$$.update(group);
      }
    });
   }
}
