import { Component, Input, OnInit } from '@angular/core';
import { modalState } from '../../models/modal-state';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user-group',
  templateUrl: './create-user-group.component.html',
  styleUrls: ['./create-user-group.component.scss'],
})
export class CreateUserGroupComponent implements OnInit{
[x: string]: any;
  @Input() modalType: modalState;

  createUserGroupForm: FormGroup;
  isLoading: boolean;

  constructor(private _fb: FormBuilder, private _dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.createUserGroupForm = this.buildFormGroup();

  }
  buildFormGroup() {
    return this._fb.group({});
  }

  closeModal() {
    this._dialog.closeAll();
  }
}
