import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from '@app/model/convs-mgr/classroom';

import { CreateUserGroupComponent } from '../../modals/create-user-group/create-user-group.component';
import { DeleteUserGroupModalComponent } from '../../modals/delete-user-group-modal/delete-user-group-modal.component';

@Component({
  selector: 'app-user-groups-list',
  templateUrl: './user-groups-list.component.html',
  styleUrls: ['./user-groups-list.component.scss'],
})
export class UserGroupsListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() groupSelect = new EventEmitter<string>();

  emptyPageStyle= {
    'padding-top': '7rem'
  }


  displayedColumns = [
    'className',
    'users',
    'description',
    'course',
    'actions'
  ];

  dataSource = new MatTableDataSource<Classroom>();

  constructor(private _dialog: MatDialog, private _classroomService: ClassroomService) { }
  

  ngOnInit(): void {
    this._classroomService.getAllClassrooms().subscribe(
     (data: Classroom[]) => {
      //  this.dataSource = new MatTableDataSource<Classroom>(data);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
 }
    );
   }

  openEditModal(group: Classroom) {
    const dialogRef = this._dialog.open(CreateUserGroupComponent, {
      data: {group, edit: true}
    });
  }

  openDeleteModal(id:string) {
    this._dialog.open(DeleteUserGroupModalComponent,
      {
        data: {id}
      });
      
  }
  clickGroupRow(groupId:string){
    this.groupSelect.emit(groupId)
  }

}
