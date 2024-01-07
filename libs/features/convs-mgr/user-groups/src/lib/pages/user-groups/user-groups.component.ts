import { Router } from '@angular/router';
import { Component} from '@angular/core';

@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss'],
})
export class UserGroupsComponent {
  constructor(
    private _route:Router 
  ){}

  redirectToGroup(groupId:string){
    this._route.navigate(['user-groups', groupId])
  }
}
