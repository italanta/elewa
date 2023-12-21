import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsComponent } from './pages/user-groups/user-groups.component';
import { SingleUserGroupComponent } from './pages/single-user-group/single-user-group.component';
import { UserGroupsHeaderComponent } from './components/user-groups-header/user-groups-header.component';
import { UserGroupsListComponent } from './components/user-groups-list/user-groups-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    UserGroupsComponent,
    SingleUserGroupComponent,
    UserGroupsHeaderComponent,
    UserGroupsListComponent,
  ],
})
export class FeaturesConvsMgrUserGroupsModule {}
