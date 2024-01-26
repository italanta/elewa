import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SubSink } from 'subsink';

import { EnrolledLearnersService } from '@app/state/convs-mgr/learners';
import { EnrolledEndUser, EnrolledEndUserStatus } from '@app/model/convs-mgr/learners';
import { Classroom } from '@app/model/convs-mgr/classroom';

import { modalState } from '../../models/modal-state';

@Component({
  selector: 'app-add-user-to-group-modal',
  templateUrl: './add-user-to-group-modal.component.html',
  styleUrls: ['./add-user-to-group-modal.component.scss'],
})
export class AddUserToGroupModalComponent implements OnInit, OnDestroy {

  @Input() modalType:modalState;

  private _sBs = new SubSink();
  addUserToGroupForm:FormGroup;
  isLoading:boolean;
  classroom: Classroom;

  constructor(private _fb:FormBuilder, 
              private _dialog:MatDialog,
              private _enrollLearnerService: EnrolledLearnersService,
              @Inject(MAT_DIALOG_DATA) public data: Classroom
              )
    { }

  ngOnInit(): void {
    this.classroom = this.data;
    this.buildForm();
  }

  buildForm(){
    this.addUserToGroupForm = this._fb.group({
      userName:['', Validators.required],
      phoneNumber:['', Validators.required]
    })
  }

  closeModal(){
    this._dialog.closeAll();
  }

  addUserToGroup() 
  {
    if(this.addUserToGroupForm.valid) {
      const newUser: EnrolledEndUser = {
        name: this.addUserToGroupForm.value.userName,
        phoneNumber: this.addUserToGroupForm.value.phoneNumber,
        classId: this.classroom.id as string,
        status: EnrolledEndUserStatus.Inactive
      }

      const addLearner$ = this._enrollLearnerService.addLearner$(newUser, this.classroom.id);

      this._sBs.sink = addLearner$.subscribe();

      this._dialog.closeAll();
    }
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
