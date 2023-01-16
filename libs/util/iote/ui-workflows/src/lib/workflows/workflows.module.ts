import { NgModule } from '@angular/core';
import { MultiLangModule } from '@ngfi/multi-lang';
import { MaterialBricksModule } from '@iote/bricks-angular';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialDesignModule } from '@iote/bricks-angular';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-modal/delete-confirmation-modal.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';
import { ConfirmationDialogComponent } from './components/confirmation-modal/confirmation-modal.component';

/**
 * Workflows Module. Main entrypoint of the module.
 *
 * Library can later be split in more modules as workflows become more specific.
 */
@NgModule({
    imports: [MaterialDesignModule, MultiLangModule, MaterialBricksModule, FlexLayoutModule],
    // Belongs more in a Layout Module, but temp stored here.
    declarations: [DeleteConfirmationDialogComponent, InfoPanelComponent, ConfirmationDialogComponent],
    providers: [],
    exports: [DeleteConfirmationDialogComponent, ConfirmationDialogComponent]
})
export class UIWorkflowModule { }
