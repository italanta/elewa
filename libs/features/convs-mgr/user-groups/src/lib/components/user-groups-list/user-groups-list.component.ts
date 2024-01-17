import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateUserGroupComponent } from '../../modals/create-user-group/create-user-group.component';
import { modalState } from '../../models/modal-state';
import { DeleteUserGroupModalComponent } from '../../modals/delete-user-group-modal/delete-user-group-modal.component';
import { UserGroups } from '@app/model/convs-mgr/user-groups';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-user-groups-list',
  templateUrl: './user-groups-list.component.html',
  styleUrls: ['./user-groups-list.component.scss'],
})
export class UserGroupsListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Output() groupSelect = new EventEmitter<string>();


  displayedColumns = [
    'className',
    'users',
    'descriptionName',
    'course',
    'actions'
  ];

  dataSource = new MatTableDataSource<UserGroups>();

  constructor(private _dialog: MatDialog, private userGroupsService:GroupsService) { }
  

  ngOnInit(): void {
    this.userGroupsService.getUserGroups().subscribe(
     (data: UserGroups[]) => {
       this.dataSource = new MatTableDataSource<UserGroups>(data);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;
 }
    );
   }

  openEditModal() {
    const dialogRef = this._dialog.open(CreateUserGroupComponent, {
      width: '610px',
    });
    const dialogInstance = dialogRef.componentInstance;
    dialogInstance.modalType = modalState.Edit;
  }

  openDeleteModal(id:string) {
    console.log(id)
    this._dialog.open(DeleteUserGroupModalComponent,
      {
        width: '610px',
        data: {id}
      });
      
  }
  clickGroupRow(groupId:string){
    this.groupSelect.emit(groupId)
  }

}
