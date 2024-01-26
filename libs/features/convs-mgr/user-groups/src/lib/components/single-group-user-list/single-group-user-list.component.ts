import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserToGroupModalComponent } from '../../modals/add-user-to-group-modal/add-user-to-group-modal.component';

import { Router } from '@angular/router';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from '@app/model/convs-mgr/classroom';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-single-group-user-list',
  templateUrl:'./single-group-user-list.component.html',
  styleUrls: ['./single-group-user-list.component.scss'],
})
export class SingleGroupUserListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  displayedColumns = [
    'className',
    'phonenumber',
    'date',
    'status',
    'actions'
  ];

  dataSource = new MatTableDataSource<any>();
  classRoom: any;

  classRoomId = '';

  constructor(
    private _dialog: MatDialog,
    private classroomService: ClassroomService,
    private router$$: Router
    ) {
      this.classRoomId = this.router$$.url.split('/')[2].toString();
    }

  ngOnInit() {
    this.loadClassroom();
  }

  loadClassroom() {
    this.classroomService.getSpecificClassroom(this.classRoomId).subscribe(
      (data) => {
        this.classRoom = data;
        const classRoom = this.classRoom as Classroom;
        const users = classRoom.users as any[];
        this.dataSource.data=users;
      }
    );
  }

  openAddModal() {
    const dialogRef = this._dialog.open(AddUserToGroupModalComponent, {
      width: '400px', 
    });

    dialogRef.afterClosed().subscribe((result:Classroom)=>{
      if(result){
        this.addUserGroup(result)
      }
    })
  }
  addUserGroup(classroom: Classroom) {
    this.classroomService.addClassroom(classroom).subscribe(() => {
      // this.loadClassroom();
    });
  }   
  // openDeleteModal() {}
}
