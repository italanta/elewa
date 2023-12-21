import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsComponent } from './pages/user-groups/user-groups.component';
import { SingleUserGroupComponent } from './pages/single-user-group/single-user-group.component';

@NgModule({
  imports: [CommonModule],
  declarations: [UserGroupsComponent, SingleUserGroupComponent],
})
export class FeaturesConvsMgrUserGroupsModule {}
