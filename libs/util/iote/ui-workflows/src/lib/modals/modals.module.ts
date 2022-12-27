import { NgModule } from '@angular/core';

import { MaterialDesignModule, FlexLayoutModule } from '@iote/bricks-angular';
import { UIModalComponent } from './components/modal/modal.component';
import { PDFModalComponent } from './components/pdf-modal/pdf-modal.component';

/**
 * Modals Module. Main entrypoint of the module.
 *
 * Library can later be split in more modules as workflows become more specific.
 */
@NgModule({
    imports: [
        MaterialDesignModule, FlexLayoutModule],
    declarations: [UIModalComponent, PDFModalComponent],
    providers: [],
    exports: [UIModalComponent]
})
export class UIModalsModule { }
