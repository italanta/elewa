import { Component, Input } from '@angular/core';
import { modalState } from '../../models/modal-state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClassroomService } from '@app/state/convs-mgr/classrooms';

@Component({
  selector: 'app-add-user-to-group-modal',
  templateUrl: './add-user-to-group-modal.component.html',
  styleUrls: ['./add-user-to-group-modal.component.scss'],
})
export class AddUserToGroupModalComponent {
  [x:string]:any;
  @Input() modalType:modalState;

  addUserToGroupForm:FormGroup;
  isLoading:boolean;

  constructor(private _fb:FormBuilder, private _dialog:MatDialog, private _classroomService:ClassroomService){
    this.addUserToGroupForm = this._fb.group({
      userName:[''],
      phoneNumber:['']
    })
  }

  buildFormGroup(){
    return this._fb.group({});
  }

  submittedUserForm(){
    this._classroomService.addClassroom(this.addUserToGroupForm.value)

  }

  closeModal(){
    this._dialog.closeAll();
  }
}
