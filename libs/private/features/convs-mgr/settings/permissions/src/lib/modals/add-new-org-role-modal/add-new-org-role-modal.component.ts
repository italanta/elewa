import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { take } from 'rxjs/operators';

import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';

@Component({
  selector: 'clm-add-new-org-role-modal',
  templateUrl: './add-new-org-role-modal.component.html',
  styleUrls: ['./add-new-org-role-modal.component.scss']
})
export class AddNewOrgRoleModalComponent implements OnInit {
  
  org: Organisation;
  role: FormControl = new FormControl();

  creatingNewRole: boolean = false;

  constructor(private _dialog: MatDialog,
              public dialogRef: MatDialogRef<AddNewOrgRoleModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _orgService$$: OrganisationService
  ) {}
  
  ngOnInit(): void {
    this._orgService$$.getActiveOrg().pipe(take(1)).subscribe(((org) => {
      if (org) {
        this.org = org;
      }
    }));
  }

  saveNewRole() {
    if (this.org) {
      this.creatingNewRole = true;
      this.updateRoleOnObjects(this.data, this.role.value);

      let orgRoles = this.org.roles;
      orgRoles.push(this.role.value);
      this.org.roles = orgRoles;

      this._orgService$$.updateOrgDetails(this.org);
    }
  }

  updateRoleOnObjects(permissionsFormGroup: FormGroup, newRole: string) {
    let domains = permissionsFormGroup.controls;
    Object.keys(domains).forEach(domain => {      
      let domainControls = permissionsFormGroup.get(domain) as FormGroup;
      let roleControls = domainControls.controls
      Object.keys(roleControls).forEach(perGroup => {
        let permission = domainControls.get(perGroup) as FormGroup;
        let roles = permission.value;
        roles[newRole] = false;        
      });
    });

    this._orgService$$.updateOrgPermissions(permissionsFormGroup).subscribe(() => {
      this.creatingNewRole = false; 
      this.dialogRef.close();
    });
  }
}
