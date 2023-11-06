import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Organisation } from '@app/model/organisation';
import { AppClaimDomains } from '@app/private/model/access-control';

import { OrganisationService } from '@app/private/state/organisation/main';

// import { FileStorageService } from '@app/features/files';

import { UpdateCompanyLogoModalComponent } from '../../modals/update-company-logo-modal/update-company-logo-modal.component';
import { AddChannelModalComponent } from '../../modals/add-channel-modal/add-channel-modal.component';
import { CardElement } from '../../interfaces/channneldetails.interface';




const ELEMENT_DATA: CardElement[] = [
  { ChannelName: "farmBetter Kenya", platform: 'WhatsApp' , firstStory: "Plant Care", download: 'EditChannel' },
  { ChannelName: "kenyaScouts Association", platform: 'Messenger', firstStory: "Scout Rules", download: 'EditChannel' },
  
];

@Component({
  selector: 'company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.scss']
})


export class CompanyDataComponent implements OnInit {

  activeOrg: Organisation;
  orgDataFormGroup: FormGroup;

  activeOrgLoaded: boolean;
  editOrg = false;
  formIsReady = false;
  showButtons = false;


  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;

 

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              // private _fileStorageService$$: FileStorageService,
              private _orgService$$: OrganisationService
  ) { }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
    this.getActiveOrg();
  }

  getActiveOrg() {
    this._orgService$$.getActiveOrg().subscribe((org) => {
      if (org) {
        this.activeOrgLoaded = true;
        this.activeOrg = org;
        this.buildOrgDataFormGroup(org);
      }
    })
  }

  buildOrgDataFormGroup(orgData: Organisation) {    
    this.orgDataFormGroup = this._fb.group({
      id: [orgData.id],
      logoUrl: [orgData.logoUrl ?? ''],
      name: [orgData.name ?? ''],
      email: [orgData.email ?? ''],
      phone: [orgData.phone ?? ''],
      address: this._fb.group({
        streetName: [orgData.address!?.streetName ?? ''],
        city: [orgData.address!?.city ?? ''],
        postalCode: [orgData.address!?.postalCode ?? ''],
        postalAddress: [orgData.address!?.postalAddress ?? ''],
      })
    })
    this.formIsReady = true;
    this.orgDataFormGroup.disable();
  }

  editOrgProfile(event: Event) {
    event.preventDefault(); 
    this.editOrg = !this.editOrg;
    this.showButtons = this.editOrg; // Show buttons only when editing
    if (this.editOrg) {
      this.orgDataFormGroup.enable();
    } else {
      this.updateOrg();
      this.orgDataFormGroup.disable();
    }
  }
  

  updateOrg() {
    let orgFormData = this.orgDataFormGroup.value;
    this._orgService$$.updateOrgDetails(orgFormData, orgFormData.logoUrl);
  }

  newCompanyLogo() {
    this._dialog.open(UpdateCompanyLogoModalComponent, {
      data: this.activeOrg}).afterClosed().subscribe();
  }

  removePhoto() {
    // this._fileStorageService$$.deleteSingleFile(this.activeOrg.logoUrl).subscribe();
    this.activeOrg.logoUrl = '';
    this._orgService$$.updateOrgDetails(this.activeOrg);
  }

  addChannel(){
    this._dialog.open(AddChannelModalComponent, {
      minWidth: '30%',
      minHeight: '338px',
    });
  }
 
}
