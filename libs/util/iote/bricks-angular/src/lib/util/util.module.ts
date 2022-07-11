import { NgModule } from '@angular/core';

import { MoneyPipe } from './pipes/money.pipe';

import { TransclusionHelper } from './services/transclusion-helper.service';

import { Logger } from './services/logger.service';
import { EventLogger } from './services/event-logger.service';

/**
 * Util Module. Imported in Root.
 *
 * General Util which can be reused in other projects.
 *
 * Logging, Transclusion, ..
 */
@NgModule({
  imports: [],
  declarations: [MoneyPipe],
  providers: [Logger, TransclusionHelper],
  exports: [MoneyPipe]
})
export class UtilModule { }
