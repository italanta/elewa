import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { MatStepperModule } from '@angular/material/stepper';

import { FlexLayoutModule, MaterialBricksModule, MaterialDesignModule, MaterialFormBricksModule } from '@iote/bricks-angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { StoryEditorStateModule } from '@app/state/convs-mgr/story-editor';

import { ConvlPageModule } from '@app/elements/layout/page-convl';
import { ToastModule } from '@app/elements/layout/toast'

import { BlocksLibraryModule } from '@app/features/convs-mgr/stories/builder/blocks/library/main';
import { ConvsMgrAnchorBlockModule } from '@app/features/convs-mgr/stories/builder/blocks/library/anchor-block';
import { BuilderNavbarModule } from '@app/features/convs-mgr/stories/builder/nav';

import { FlowBuilderStateModule } from '@app/features/convs-mgr/stories/builder/flow-builder/state';

import { FlowBuilderPageComponent } from './pages/story-editor/flow-builder.page';

import { FlowEditorComponent } from './components/flow-editor/flow-editor.component';
import { FlowLibraryComponent } from './components/flow-library/flow-library.component';
import { FlowPreviewComponent } from './components/flow-preview/flow-preview.component';
import { FlowLibraryItemComponent } from './components/flow-library-item/flow-library-item.component';

import { FlowBuilderRouterModule } from './flow-builder.router.module';

@NgModule({
  imports: [
    CommonModule, MultiLangModule, PortalModule,
    MaterialDesignModule, FlexLayoutModule, MaterialBricksModule,
    MaterialFormBricksModule, FormsModule, ReactiveFormsModule,
    ConvlPageModule, ConvsMgrAnchorBlockModule,
    BlocksLibraryModule, StoryEditorStateModule,
    MatStepperModule,
    ToastModule,

    BuilderNavbarModule,
    FlowBuilderStateModule,

    FlowBuilderRouterModule
  ],

  declarations: [
    FlowEditorComponent,
    FlowLibraryComponent,
    FlowPreviewComponent,
    FlowLibraryItemComponent,

    FlowBuilderPageComponent
  ],

  providers: [
  ],
})
export class FlowBuilderModule { }
