import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserGroups } from '@app/model/convs-mgr/user-groups';
import { UserGroupService } from '@app/state/convs-mgr/user-group';

@Component({
  selector: 'app-single-group-header',
  templateUrl: './single-group-header.component.html',
  styleUrls: ['./single-group-header.component.scss'],
})
export class SingleGroupHeaderComponent {  

  userGroupName = '';


  constructor(
    private _router: Router,
    private _userGroupService: UserGroupService
  ) {}

  ngOnInit() {
    this.loadUserGroup();
  }

  loadUserGroup() {
    const userGroupId = this._router.url.split('/')[2].toString();
    this._userGroupService.getUserGroup$(userGroupId).subscribe(
      (data: any) => {
        console.log("", data)
        this.userGroupName = data.className;
      }
    );                
  }
}
