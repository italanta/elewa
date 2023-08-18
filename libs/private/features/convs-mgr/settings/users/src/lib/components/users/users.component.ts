import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

import { SubSink } from 'subsink';

import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { keys as __keys, pickBy as __pickBy, intersection as __intersection} from 'lodash';

import { __DateFromStorage } from '@iote/time';

import { iTalUser } from '@app/model/user';
import { Organisation } from '@app/model/organisation';
import { AppClaimDomains } from '@app/model/access-control';

import { UserStore } from '@app/state/user';
import { OrganisationService } from '@app/private/state/organisation/main';
import { CLMUsersService } from '@app/private/state/user/base';

import { NewUserDialogComponent } from '../../modals/new-user-dialog/new-user-dialog.component';
import { UpdateUserModalComponent } from '../../modals/update-user-modal/update-user-modal.component';

const DATA: iTalUser[] = []

@Component({
  selector: 'clm-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy, AfterViewInit {
  private _sbS = new SubSink();

  org: Organisation;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['name', 'email', 'roles', 'activity', 'status', 'actions'];

  dataSource = new MatTableDataSource(DATA);

  searchFormGroup: FormGroup;

  orgLoaded: boolean;

  orgRoles: string[];
  
  readonly CAN_PERFOM_ADMIN_ACTIONS = AppClaimDomains.Admin;

  constructor(private _fb: FormBuilder,
              private dialog: MatDialog,
              private _orgsService$$: OrganisationService,
              private _users$$: UserStore,
              private _usersService$$: CLMUsersService,
              private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildSearchFormGroup();
    this.getOrg();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const sortState: Sort = { active: 'fullName', direction: 'asc' };

    if (this.sort) {
      this.sort.active = sortState.active;
      this.sort.direction = sortState.direction;
      this.sort.sortChange.emit(sortState);
    }

    this.cdref.detectChanges();
  }

  buildSearchFormGroup() {
    this.searchFormGroup = this._fb.group({
      role: [[]]
    })
  }

  getOrg() {
    this._orgsService$$.getActiveOrg().subscribe((org) => {
      if (org) {
        this.orgLoaded = true;
        this.org = org;
        this._getOrgUsers(org.id!);
        this.orgRoles = org.roles;
      }
    });
  }

  getRoles(roles: {}): string[] {
    return __keys(__pickBy(roles));
  }

  private _getOrgUsers(orgId: string) {
    this._sbS.sink = combineLatest([
      this._users$$.getOrgUsers(orgId), 
      this.searchFormGroup.controls['role'].valueChanges.pipe(startWith(''))]).subscribe(([users, role]) => {
        this.dataSource.data = users.filter((user) => {
          let userRoles = __keys(__pickBy(user.roles[user.activeOrg]));
          userRoles = this.removeItem(userRoles);          
          return role == '' ? user : __intersection(userRoles, role).length > 0;
        });
    })
  }

  removeItem(roles: string[]) {
    let data  = ['access', 'principal'];
    data.forEach((el) => {
      let index = roles.indexOf(el);
      if (index > -1) {
        roles.splice(index, 1);
      }
    })
    return roles;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getDate(date: any): string {
    return __DateFromStorage(date).format('DD/MM/YYYY');
  }

  inviteMember() {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      minWidth: '500px',
      minHeight: '200px',
      data: this.org
    });
  }

  updateUserDetails(user: iTalUser) {
    const dialogRef = this.dialog.open(UpdateUserModalComponent, {
      minWidth: '500px',
      minHeight: '200px',
      data: {
        org : this.org,
        user: user
      }
    });
  }

  removerUser(user: iTalUser) {
    this._orgsService$$.removeUserFromOrg(user);
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
