import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';

@Component({
  selector: 'app-single-group-header',
  templateUrl: './single-group-header.component.html',
  styleUrls: ['./single-group-header.component.scss'],
})
export class SingleGroupHeaderComponent {  

  userGroupName = '';


  constructor(
    private _router: Router,
    private classroomService: ClassroomService
  ) {}

  ngOnInit() {
    this.loadClassroom();
  }

  loadClassroom() {
    const userGroupId = this._router.url.split('/')[2].toString();
    this.classroomService.getSpecificClassroom(userGroupId).subscribe(
      (data: any) => {
        this.userGroupName = data.className;
      }
    );                
  }
}
