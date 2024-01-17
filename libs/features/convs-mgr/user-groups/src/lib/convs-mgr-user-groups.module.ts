
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { UserGroupsComponent } from './pages/user-groups/user-groups.component';
import { SingleUserGroupComponent } from './pages/single-user-group/single-user-group.component';
import { UserGroupsHeaderComponent } from './components/user-groups-header/user-groups-header.component';
import { UserGroupsListComponent } from './components/user-groups-list/user-groups-list.component';
import { CreateUserGroupComponent } from './modals/create-user-group/create-user-group.component';
import { UserGroupsRouterModule } from './user-groups.router.module';
import { MultiLangModule } from '@ngfi/multi-lang';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteUserGroupModalComponent } from './modals/delete-user-group-modal/delete-user-group-modal.component';
import { SingleGroupHeaderComponent } from './components/single-group-header/single-group-header.component';
import { SingleGroupUserListComponent } from './components/single-group-user-list/single-group-user-list.component';
import { AddUserToGroupModalComponent } from './modals/add-user-to-group-modal/add-user-to-group-modal.component';
import { DeleteUserFromGroupModalComponent } from './modals/delete-user-from-group-modal/delete-user-from-group-modal.component';
// import { UserGroupsStore } from 'libs/state/convs-mgr/user-groups/src/lib/store/user-groups.store';
// import { UserGroupsService } from 'libs/state/convs-mgr/user-groups/src/lib/service/user-groups.service';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    UserGroupsRouterModule,
    MatTableModule,
    MatPaginatorModule,
    MultiLangModule,
    ReactiveFormsModule,
    MatMenuModule,
  ],
  declarations: [
    UserGroupsComponent,
    SingleUserGroupComponent,
    UserGroupsHeaderComponent,
    UserGroupsListComponent,
    CreateUserGroupComponent,
    DeleteUserGroupModalComponent,
    SingleGroupHeaderComponent,
    SingleGroupUserListComponent,
    AddUserToGroupModalComponent,
    DeleteUserFromGroupModalComponent,
  ],
  providers:[]
})
export class ConvsMgrUserGroupsModule {}
