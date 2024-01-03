import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";

import { UserGroupsComponent } from "./pages/user-groups/user-groups.component";
import { SingleUserGroupComponent } from "./pages/single-user-group/single-user-group.component";

const USERGROUPS_ROUTES: Route[] = [
    {
        path: '',
        component: UserGroupsComponent
    },
    {
        path: ':id',
        component: SingleUserGroupComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(USERGROUPS_ROUTES)],
    exports: [RouterModule]
})
export class UserGroupsRouterModule { }