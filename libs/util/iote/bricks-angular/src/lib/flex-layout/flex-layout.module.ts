import { NgModule } from '@angular/core';

import { FlexLayoutModule as LibFlexLayoutModule } from '@angular/flex-layout';

/**
 * Layer of indirection for Flex Layout
 */
@NgModule({
  imports: [LibFlexLayoutModule],
  exports: [LibFlexLayoutModule]
})
export class FlexLayoutModule { }
