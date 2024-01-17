import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { userGroupsStore } from './store/user-groups.store';

@NgModule({
  imports: [CommonModule],
})

export class userGroupsStateModule{
    static forRoot():ModuleWithProviders<userGroupsStateModule>{
        return{
            ngModule:userGroupsStateModule,
            providers:[userGroupsStore],
        }
    }
}


