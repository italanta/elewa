import { UserGroups } from '@app/model/convs-mgr/user-groups';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserGroupService } from '@app/state/convs-mgr/user-group';
import { Observable, subscribeOn } from 'rxjs';
import { SubSink } from 'subsink';


@Component({
  selector: 'app-delete-user-group-modal',
  templateUrl: './delete-user-group-modal.component.html',
  styleUrls: ['./delete-user-group-modal.component.scss'],
})
export class DeleteUserGroupModalComponent implements  OnInit ,OnDestroy {
  private _sBs = new SubSink();

  userGroup:any;
  userGroupId = '';

  constructor(
    private _dialog:MatDialog,
    private userGroupService:UserGroupService,
    @Inject(MAT_DIALOG_DATA)public data:{ id: string}

    ){
      this.userGroupId = this.data.id
    }
  ngOnInit(): void {
    this.getUserGroup();

  }
  getUserGroup(){
    this.userGroupService.getUserGroup$(this.userGroupId).subscribe(
      (userGroup) => {
        this.userGroup = userGroup;
      }
    )
  }



  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }

  // deleteUserGroup (){
  //   this._sBs.sink = this.userGroupService.deleteUserGroups$(this.data.id){
  //     this._dialog.closeAll()
  //   }
  //     } ;
   
  deleteUserGroup()
  {
    console.log(this.data);
    this.userGroupService.deleteUserGroups$(this.userGroup);
    this._dialog.closeAll();
  
    
  }
    }