import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule, MaterialDesignModule } from '@iote/bricks-angular';

import { ConvlPageModule } from '@app/elements/layout/page-convl';

import { HomePageComponent } from './pages/home/home.page';
import { StoryListItemComponent } from './components/story-list-item/story-list-item.component';

import { NewStoryService } from './services/new-story.service';

import { ConvsMgrHomeRouterModule } from './convs-mgr-home.router.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialDesignModule, FlexLayoutModule,

    ConvlPageModule,

    ConvsMgrHomeRouterModule],

    declarations: [HomePageComponent, StoryListItemComponent],

    providers: [NewStoryService]
})
export class ConvsMgrHomeModule {}
