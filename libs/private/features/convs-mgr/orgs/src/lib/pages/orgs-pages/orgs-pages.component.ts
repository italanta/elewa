import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SubSink } from 'subsink';
import { TranslateService } from '@ngfi/multi-lang';

import { iTalUser } from '@app/model/user'; 
import { Organisation } from '@app/model/organisation';

import { UserStore } from '@app/state/user';

import { OrganisationService } from '@app/private/state/organisation/main';

@Component({
  selector: 'app-org-page',
  templateUrl: './orgs-pages.component.html',
  styleUrls: ['./orgs-pages.component.scss']
})

export class OrgsPagesComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  orgFormGroup: FormGroup;

  user: iTalUser;
  organisation: Organisation;

  activeOrg: FormControl = new FormControl();

  orgsList: string[];
  creatingOrg: boolean;

  lang: 'en' | 'fr' | 'nl'

  constructor(private _router$$: Router,
              private _fb: FormBuilder,
              private _translateService: TranslateService,
              private _userService$$: UserStore,
              private _orgService: OrganisationService
  ) 
  {
    this.lang = this._translateService.initialise();
  }

  ngOnInit(): void {
    this._sbS.sink = this._userService$$.getUser().subscribe(u => this.user = u);
    this.buildOrgForm();
  }

  setLang(lang: 'en' | 'fr' | 'nl') {
    this._translateService.setLang(lang);
  }


  buildOrgForm() {
    this.orgFormGroup = this._fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', Validators.required],
      address: this._fb.group({
        streetName: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        postalAddress: ['', Validators.required],
      })
    })
  }

  createNewOrg() {
    this.creatingOrg = true;
    this._orgService.createOrg(this.orgFormGroup.value as Organisation, this.user);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
