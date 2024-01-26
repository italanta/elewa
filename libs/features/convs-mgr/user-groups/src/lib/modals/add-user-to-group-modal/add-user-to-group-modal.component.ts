import { Component, Input } from '@angular/core';
import { modalState } from '../../models/modal-state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GroupsService } from '../../services/groups.service';

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

  constructor(private _fb:FormBuilder, private _dialog:MatDialog, private _group:GroupsService){
    this.addUserToGroupForm = this._fb.group({
      userName:[''],
      phoneNumber:['']
    })
  }

  buildFormGroup(){
    return this._fb.group({});
  }

  submittedUserForm(){
    console.log(this.addUserToGroupForm.value)
    this._group.addGroup(this.addUserToGroupForm.value)

  }

  closeModal(){
    this._dialog.closeAll();
  }
}
