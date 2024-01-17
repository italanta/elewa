import { Injectable } from '@angular/core';
import { UserGroupService } from '@app/state/convs-mgr/user-group';

import { UserGroups } from '@app/model/convs-mgr/user-groups';
import { Observable, map, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  
  deleteUserGroups$(id: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private groupsService :  UserGroupService) { }

  createGroup(data : UserGroups ){
    this.groupsService.addUserGroups(data).subscribe((response) =>{
      console.log(response)
    })
  }

  getUserGroups(): Observable<UserGroups[]> {
    return this.groupsService.getAllUserGroups().pipe(
      map(response => response)
    );
   }
}
