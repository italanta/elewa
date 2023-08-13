import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss'],
})
export class AddMemberModalComponent {

  constructor(
    public dialogRef: MatDialogRef<AddMemberModalComponent>,
    private _fb: FormBuilder
  ) {}

  emailForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]],
  });

  get email() {
    return this.emailForm.get('email');
  }

  get role() {
    return this.emailForm.get('role');
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.email?.value);
    console.log(this.role?.value);
  }
}
