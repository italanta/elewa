import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';

import { BlockPortalService } from './providers/block-portal.service';

@NgModule({
  imports: [
    CommonModule,
    PortalModule,
    ReactiveFormsModule,
  ],

  // Injector which creates all block types within the editor context.
  providers: [
    BlockPortalService
  ],
})
export class BlocksLibraryModule {}
