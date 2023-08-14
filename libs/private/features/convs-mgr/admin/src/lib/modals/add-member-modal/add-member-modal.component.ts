import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-member-modal',
  templateUrl: './add-member-modal.component.html',
  styleUrls: ['./add-member-modal.component.scss'],
})
export class AddMemberModalComponent {

  constructor(
    public dialogRef: MatDialogRef<AddMemberModalComponent>,
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { roles: string[] }
  ) {}

  emailForm = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]],
  });

  get email() {
    return this.emailForm.get('email') as FormControl;
  }

  get role() {
    return this.emailForm.get('role') as FormControl;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    console.log(this.email?.value);
    console.log(this.role?.value);
  }
}
