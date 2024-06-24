import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { MultiLangModule } from '@ngfi/multi-lang';

import { ClmMicroAppPageComponent } from './components/clm-micro-app-page/clm-micro-app-page.component';
import { MicroAppsFooterComponent } from './components/micro-apps-footer/micro-apps-footer.component';
import { MicroAppsHeaderComponent } from './components/micro-apps-header/micro-apps-header.component';


@NgModule({
  imports: [CommonModule,
            MultiLangModule,
            RouterModule
  ],
  declarations: [ClmMicroAppPageComponent,
                  MicroAppsFooterComponent,
                  MicroAppsHeaderComponent,
  ],
  exports: [ClmMicroAppPageComponent,
            
  ]
})
export class ClmMicroAppLayoutModule {}
