import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsComponent } from './pages/user-groups/user-groups.component';
import { SingleUserGroupComponent } from './pages/single-user-group/single-user-group.component';
import { UserGroupsHeaderComponent } from './components/user-groups-header/user-groups-header.component';
import { UserGroupsListComponent } from './components/user-groups-list/user-groups-list.component';
import { CreateUserGroupComponent } from './modals/create-user-group/create-user-group.component';
import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { UserGroupsRouterModule } from './user-groups.router';

@NgModule({
  imports: [
    CommonModule,
    ConvlPageModule,
    UserGroupsRouterModule
  ],
  declarations: [
    UserGroupsComponent,
    SingleUserGroupComponent,
    UserGroupsHeaderComponent,
    UserGroupsListComponent,
    CreateUserGroupComponent,
  ],
})
export class ConvsMgrUserGroupsModule {}
