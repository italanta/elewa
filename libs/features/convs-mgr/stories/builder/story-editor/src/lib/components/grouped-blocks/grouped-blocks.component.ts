import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';

import {
  StoryBlock,
  StoryBlockTypes,
} from '@app/model/convs-mgr/stories/blocks/main';

import { Coordinate } from '@app/model/convs-mgr/stories/blocks/main';
import { StoryEditorFrame } from '@app/features/convs-mgr/stories/builder/editor-state';

import { DragDropService } from '../../providers/drag-drop.service';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { Story, StoryModuleTypes } from '@app/model/convs-mgr/stories/main';
import { EMPTY, of, switchMap } from 'rxjs';
import { BlockFilterFactory } from '../../factories/block-library-filter.factory';

@Component({
  selector: 'convl-grouped-blocks',
  templateUrl: './grouped-blocks.component.html',
  styleUrls: ['./grouped-blocks.component.scss'],
})
export class GroupedBlocksComponent implements OnInit, OnDestroy {
  @Input() groupedBlocks: StoryBlock[];
  @Input() frame: StoryEditorFrame;

  private _sBs = new SubSink();

  filteredBlocks: StoryBlock[] =[];

  story: Story;

  coordinates: Coordinate;

  constructor(private dragService: DragDropService, private activeStory$: ActiveStoryStore) {}

  ngOnInit() {
    this._sBs.sink = this.dragService.coord$.subscribe((position) => {
      this.coordinates = position;
    });
  
    // Use switchMap to handle the active story stream
    this._sBs.sink = this.activeStory$.get().pipe(
      switchMap(story => {
        if (story) {
          this.story = story; 
          this.filterBlocks(story);
          return of(story); 
        }
        return EMPTY;
      })
    ).subscribe({
      next: (story) => console.log("The story is", this.activeStory$._activeStory, story),
      error: (error) => console.error("Error fetching story", error),
      complete: () => console.log("Story fetch complete")
    });
  }

  /** check icon type */
  // TODO: replace all non-svg icons with svg
  getIcon(icon: string) {
    const svgPath = icon.split('.').pop();
    return svgPath === 'svg';
  }
  /**
   * Filters the blocks based on the story type.
   */
  filterBlocks(story: Story) {
    const storyType: StoryModuleTypes = story.type ?? StoryModuleTypes.Story;

    const filterStrategy = BlockFilterFactory.getFilterStrategy(storyType);

    this.filteredBlocks = filterStrategy.filterBlocks(this.groupedBlocks);
  }

  addBlock(type: number, coordinates?: Coordinate) {
    switch (type) {
      case StoryBlockTypes.EndStoryAnchorBlock:
        this.frame.newBlock(StoryBlockTypes.EndStoryAnchorBlock, coordinates);
        break;
      case StoryBlockTypes.TextMessage:
        this.frame.newBlock(StoryBlockTypes.TextMessage, coordinates);
        break;
      case StoryBlockTypes.Input:
        this.frame.newBlock(StoryBlockTypes.Input, coordinates);
        break;
      case StoryBlockTypes.IO:
        this.frame.newBlock(StoryBlockTypes.IO, coordinates);
        break;
      case StoryBlockTypes.Location:
        this.frame.newBlock(StoryBlockTypes.Location, coordinates);
        break;
      case StoryBlockTypes.Image:
        this.frame.newBlock(StoryBlockTypes.Image, coordinates);
        break;
      case StoryBlockTypes.QuestionBlock:
        this.frame.newBlock(StoryBlockTypes.QuestionBlock, coordinates);
        break;
      case StoryBlockTypes.Document:
        this.frame.newBlock(StoryBlockTypes.Document, coordinates);
        break;
      case StoryBlockTypes.Audio:
        this.frame.newBlock(StoryBlockTypes.Audio, coordinates);
        break;
      case StoryBlockTypes.Structural:
        this.frame.newBlock(StoryBlockTypes.Structural, coordinates);
        break;
      case StoryBlockTypes.Name:
        this.frame.newBlock(StoryBlockTypes.Name, coordinates);
        break;
      case StoryBlockTypes.Email:
        this.frame.newBlock(StoryBlockTypes.Email, coordinates);
        break;
      case StoryBlockTypes.PhoneNumber:
        this.frame.newBlock(StoryBlockTypes.PhoneNumber, coordinates);
        break;
      case StoryBlockTypes.Video:
        this.frame.newBlock(StoryBlockTypes.Video, coordinates);
        break;
      case StoryBlockTypes.Sticker:
        this.frame.newBlock(StoryBlockTypes.Sticker, coordinates);
        break;
      case StoryBlockTypes.List:
        this.frame.newBlock(StoryBlockTypes.List, coordinates);
        break;
      case StoryBlockTypes.Reply:
        this.frame.newBlock(StoryBlockTypes.Reply, coordinates);
        break;
      case StoryBlockTypes.JumpBlock:
        this.frame.newBlock(StoryBlockTypes.JumpBlock, coordinates);
        break;
      case StoryBlockTypes.FailBlock:
        this.frame.newBlock(StoryBlockTypes.FailBlock, coordinates);
        break;
      case StoryBlockTypes.ImageInput:
        this.frame.newBlock(StoryBlockTypes.ImageInput, coordinates);
        break;
      case StoryBlockTypes.LocationInputBlock:
        this.frame.newBlock(StoryBlockTypes.LocationInputBlock, coordinates);
        break;
      case StoryBlockTypes.AudioInput:
        this.frame.newBlock(StoryBlockTypes.AudioInput, coordinates);
        break;
      case StoryBlockTypes.VideoInput:
        this.frame.newBlock(StoryBlockTypes.VideoInput, coordinates);
        break;
      case StoryBlockTypes.WebhookBlock:
        this.frame.newBlock(StoryBlockTypes.WebhookBlock, coordinates);
        break;
      case StoryBlockTypes.OpenEndedQuestion:
        this.frame.newBlock(StoryBlockTypes.OpenEndedQuestion, coordinates);
        break;
      case StoryBlockTypes.keyword:
        this.frame.newBlock(StoryBlockTypes.keyword, coordinates);
        break;
      case StoryBlockTypes.Event:
        this.frame.newBlock(StoryBlockTypes.Event, coordinates);
        break;
      case StoryBlockTypes.Assessment:
        this.frame.newBlock(StoryBlockTypes.Assessment, coordinates);
        break;
      case StoryBlockTypes.Conditional:
        this.frame.newBlock(StoryBlockTypes.Conditional, coordinates);
        break;
      case StoryBlockTypes.CMI5Block:
        this.frame.newBlock(StoryBlockTypes.CMI5Block, coordinates);
        break;
      default:
        break;  
    }
  }

  onDragEnd(blockType: number) {
    this.addBlock(blockType, this.coordinates);
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}
