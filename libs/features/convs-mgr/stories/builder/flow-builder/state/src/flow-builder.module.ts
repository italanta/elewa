import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiLangModule } from '@ngfi/multi-lang';

import { FlowBuilderStateProvider } from './lib/state/flow-builder-state.provider';

@NgModule({
  imports: [
    CommonModule, MultiLangModule
  ],
  providers: [
    FlowBuilderStateProvider
  ],
})
export class FlowBuilderStateModule { }
