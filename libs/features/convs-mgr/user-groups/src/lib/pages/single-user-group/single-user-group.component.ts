import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-single-user-group',
  templateUrl: './single-user-group.component.html',
  styleUrls: ['./single-user-group.component.scss'],
})
export class SingleUserGroupComponent implements OnInit, OnDestroy {

  _sbs = new SubSink();

  classRoomId = '';
  classroom: Classroom;

  constructor(private classroomService: ClassroomService,
              private router$$: Router){

    this.classRoomId = this.router$$.url.split('/')[2].toString();
  }
  ngOnInit(): void {
    this.getClassroomData();
  }

  getClassroomData()
  { 
    this._sbs.sink = this.classroomService.getSpecificClassroom(this.classRoomId)
    .subscribe((classroom) =>
    {
        if (classroom) this.classroom = classroom;
      });
  }

  ngOnDestroy(): void
  {
    this._sbs.unsubscribe();
  }
}
