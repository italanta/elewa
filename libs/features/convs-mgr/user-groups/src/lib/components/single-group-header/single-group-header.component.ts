import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';

@Component({
  selector: 'app-single-group-header',
  templateUrl: './single-group-header.component.html',
  styleUrls: ['./single-group-header.component.scss'],
})
export class SingleGroupHeaderComponent {  

  classRoomName = '';


  constructor(
    private _router: Router,
    private classroomService: ClassroomService
  ) {}

  ngOnInit() {
    this.loadClassroom();
  }

  loadClassroom() {
    const classRoomId = this._router.url.split('/')[2].toString();
    this.classroomService.getSpecificClassroom(classRoomId).subscribe(
      (data: any) => {
        this.classRoomName = data.className;
      }
    );                
  }
}
