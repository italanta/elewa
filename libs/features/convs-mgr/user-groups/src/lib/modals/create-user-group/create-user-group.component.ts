import { Component, Input, OnInit } from '@angular/core';
import { modalState } from '../../models/modal-state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GroupsService } from '../../services/groups.service';
import { take } from 'lodash';

@Component({
  selector: 'app-create-user-group',
  templateUrl: './create-user-group.component.html',
  styleUrls: ['./create-user-group.component.scss'],
})
export class CreateUserGroupComponent  {
[x: string]: any;
  @Input() modalType: modalState;

  createUserGroupForm: FormGroup;
  isLoading: boolean;

  constructor(private _fb: FormBuilder, private _dialog: MatDialog, private _group:GroupsService) {
    this.createUserGroupForm = this._fb.group({
      className:[''],
      descriptionName:['']
    })
  }
  
  buildFormGroup() {
    return this._fb.group({});
  }

  submitedUserForm(){
   
    console.log(this.createUserGroupForm.value)
    this._group.createGroup(this.createUserGroupForm.value)
    
  }

  closeModal() {
    this._dialog.closeAll();
  }
}