import { MatDialog } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';

import { modalState } from '../../models/modal-state';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private _fb: FormBuilder, private _dialog: MatDialog,private _classroomService:ClassroomService) {
    this.createUserGroupForm = this._fb.group({
      className:[''],
      description:['']
    })
  }
  
  buildFormGroup() {
    return this._fb.group({});
  }

  submitedUserForm(){
   
    console.log(this.createUserGroupForm.value)
    this._classroomService.addClassroom(this.createUserGroupForm.value)
    
  }

  closeModal() {
    this._dialog.closeAll();
  }
}