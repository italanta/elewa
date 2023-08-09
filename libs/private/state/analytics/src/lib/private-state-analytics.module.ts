import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetabaseService } from './services/metabase.service';

@NgModule({
  imports: [CommonModule],
  providers: [MetabaseService],
})
export class ConvsMgrAnalyticsModule {}
