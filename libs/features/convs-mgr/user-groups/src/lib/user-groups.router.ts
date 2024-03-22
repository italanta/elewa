import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";

import { UserGroupsComponent } from "./pages/user-groups/user-groups.component";

const USERGROUPS_ROUTES: Route[] = [
    {
        path: '',
        component: UserGroupsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(USERGROUPS_ROUTES)],
    exports: [RouterModule]
})
export class UserGroupsRouterModule { }