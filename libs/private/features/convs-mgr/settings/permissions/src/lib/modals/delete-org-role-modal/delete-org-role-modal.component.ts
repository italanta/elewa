import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';

@Component({
  selector: 'clm-delete-org-role-modal',
  templateUrl: './delete-org-role-modal.component.html',
  styleUrls: ['./delete-org-role-modal.component.scss']
})
export class DeleteOrgRoleModalComponent implements OnInit {

  org$: Observable<Organisation>;

  role: FormControl = new FormControl();

  deletingRole: boolean = false;

  constructor(private _dialog: MatDialog,
              public dialogRef: MatDialogRef<DeleteOrgRoleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _org$$: OrganisationService
  ) { }

  ngOnInit(): void {
    this.org$ = this._org$$.getActiveOrg();
  }

  deleteRole(org: Organisation) {
    if (org) {
      this.deletingRole = true;
      this.updateRoleOnObjects(this.data, this.role.value);

      let orgRoles = org.roles;

      const index = orgRoles.indexOf(this.role.value);

      if (index > -1) {
        orgRoles.splice(index, 1);
      }
      
      org.roles = orgRoles;
      this._org$$.updateOrgDetails(org);
    }
  }

  updateRoleOnObjects(permissionsFormGroup: FormGroup, newRole: string) {
    let domains = permissionsFormGroup.controls;
    Object.keys(domains).forEach(domain => {      
      let domainControls = permissionsFormGroup.get(domain) as FormGroup;
      let roleControls = domainControls.controls;
      Object.keys(roleControls).forEach(perGroup => {
        let permission = domainControls.get(perGroup) as FormGroup;
        let roles = permission.value;
        delete roles[newRole];        
      });
    });    

    this._org$$.updateOrgPermissions(permissionsFormGroup).subscribe(() => {
      this.deletingRole = false;
      this._dialog.closeAll();
    });
  }
}
