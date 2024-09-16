import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiLangModule } from '@ngfi/multi-lang';

import { FlowBuilderStateService } from './lib/services/flow-builder-state-service';

@NgModule({
  imports: [
    CommonModule, MultiLangModule
  ],
  providers: [
    FlowBuilderStateService
  ],
})
export class FlowBuilderStateModule { }
