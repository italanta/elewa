import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {
  FlexLayoutModule,
  MaterialBricksModule,
  MaterialDesignModule,
  MaterialFormBricksModule,
} from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { StoryEditorStateModule } from '@app/state/convs-mgr/story-editor';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ToastModule } from '@app/elements/layout/toast';

import { BlocksLibraryModule } from '@app/features/convs-mgr/stories/builder/blocks/library/main';
import { ConvsMgrAnchorBlockModule } from '@app/features/convs-mgr/stories/builder/blocks/library/anchor-block';
import { BuilderNavbarModule } from '@app/features/convs-mgr/stories/builder/nav';
import { FlowBuilderStateModule } from '@app/features/convs-mgr/stories/builder/flow-builder/state';
import { WhatsappFlowsStore } from '@app/state/convs-mgr/wflows';

import { FlowBuilderPageComponent } from './pages/story-editor/flow-builder.page';
import { FlowEditorComponent } from './components/flow-editor/flow-editor.component';
import { FlowLibraryComponent } from './components/flow-library/flow-library.component';
import { FlowLibraryItemComponent } from './components/flow-library-item/flow-library-item.component';
import { FlowPageSelectorComponent } from './components/page-selector/page-selector.component';
import { FlowPreviewComponent } from './components/flow-preview/flow-preview.component';
import { FlowTypeTextComponent } from './components/flow-type-text/flow-type-text.component';
import { FlowTypeInputComponent } from './components/flow-type-input/flow-type-input.component';
import { FlowDatepickInputComponent } from './components/flow-datepick-input/flow-datepick-input.component';
import { FlowBuilderRouterModule } from './flow-builder.router.module';
import { FlowButtonGroupComponent } from './components/flow-button-group/flow-button-group.component';
import { FlowCheckboxOptionsComponent } from './components/flow-checkbox-options/flow-checkbox-options.component';
import { TextAreaInputComponent } from './components/text-area-input/text-area-input.component';
import { ImageTypeInputComponent } from './components/image-type-input/image-type-input.component';
import { FlowScreenSettingsComponent } from './components/flow-screen-settings/flow-screen-settings.component';

@NgModule({
  imports: [
    CommonModule,
    MultiLangModule,
    MaterialDesignModule,
    FlexLayoutModule,
    MaterialBricksModule,
    MaterialFormBricksModule,
    FormsModule,
    ReactiveFormsModule,
    ConvlPageModule,
    ConvsMgrAnchorBlockModule,
    DragDropModule,
    BlocksLibraryModule,
    StoryEditorStateModule,
    ToastModule,

    BuilderNavbarModule,
    FlowBuilderStateModule,

    FlowBuilderRouterModule,
  ],

  declarations: [
    FlowEditorComponent,
    FlowScreenSettingsComponent,
    FlowLibraryComponent,
    FlowPreviewComponent,
    FlowLibraryItemComponent,
    FlowPageSelectorComponent,

    FlowBuilderPageComponent,
    FlowTypeTextComponent,
    FlowTypeInputComponent,
    FlowDatepickInputComponent,
    FlowButtonGroupComponent,
    FlowCheckboxOptionsComponent,
    TextAreaInputComponent,
    ImageTypeInputComponent,
  ],
  providers: [WhatsappFlowsStore],
})
export class FlowBuilderModule {}
