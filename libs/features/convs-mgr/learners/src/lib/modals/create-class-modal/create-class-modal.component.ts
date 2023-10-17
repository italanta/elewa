import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { ClassroomService } from '@app/state/convs-mgr/classrooms';

@Component({
  selector: 'app-create-class-modal',
  templateUrl: './create-class-modal.component.html',
  styleUrls: ['./create-class-modal.component.scss'],
})
export class CreateClassModalComponent implements OnInit, OnDestroy {
  createClassForm: FormGroup;
  isCreatingClass: boolean;

  private _sBs = new SubSink();

  constructor(
    private _fb: FormBuilder,
    private _classroomServ$: ClassroomService,
    public dialogRef: MatDialogRef<CreateClassModalComponent>
  ) {}

  ngOnInit() {
    this.createClassForm = this.buildFormGroup();
  }

  buildFormGroup() {
    return this._fb.group({
      className: ['', Validators.required],
      description: ['', Validators.required],
      deleted: [false],
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  submitAction() {
    this.isCreatingClass = true;
    this._sBs.sink = this._classroomServ$
      .addClassroom(this.createClassForm.value)
      .subscribe(() => {
        this.isCreatingClass = false;
        this.dialogRef.close();
      });
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
