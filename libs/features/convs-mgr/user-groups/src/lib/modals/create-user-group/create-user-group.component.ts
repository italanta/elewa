import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Component, Inject, Input } from '@angular/core';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';
import { Classroom } from '@app/model/convs-mgr/classroom';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-user-group',
  templateUrl: './create-user-group.component.html',
  styleUrls: ['./create-user-group.component.scss'],
})
export class CreateUserGroupComponent  {
[x: string]: any;

  edit: boolean;

  createUserGroupForm: FormGroup;
  isLoading: boolean;

  constructor(private _fb: FormBuilder, 
              private _dialog: MatDialog,
              private _classroomService:ClassroomService,
              @Inject(MAT_DIALOG_DATA) public data: { group: Classroom, edit: boolean; }) 
  {
    if(this.data)  this.edit = this.data.edit;

    this.createUserGroupForm = this._fb.group({
      className:[this.data ? this.data.group.className : ''],
      description:[this.data ?this.data.group.description :'']
    })
  }
  
  buildFormGroup() {
    return this._fb.group({});
  }

  onSubmit(){
    if(this.edit) {
      this.updateClassroom();
    } else {
      this.createClassroom();
    }

    this._dialog.closeAll();
  }
  
  createClassroom() {
    this._classroomService.addClassroom(this.createUserGroupForm.value).subscribe();
  }

  updateClassroom(){
    const updatedClass = {...this.data.group, ...this.createUserGroupForm.value};
    this._classroomService.updateClassroom(updatedClass)
  }

  closeModal() {
    this._dialog.closeAll();
  }
}