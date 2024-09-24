import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { SubSink } from 'subsink';

import {
  StoryBlock,
  StoryBlockTypes,
} from '@app/model/convs-mgr/stories/blocks/main';

import { Coordinate } from '../../model/coordinates.interface';
import { StoryEditorFrame } from '../../model/story-editor-frame.model';
import { DragDropService } from '../../providers/drag-drop.service';

@Component({
  selector: 'convl-grouped-blocks',
  templateUrl: './grouped-blocks.component.html',
  styleUrls: ['./grouped-blocks.component.scss'],
})
export class GroupedBlocksComponent implements OnInit, OnChanges, OnDestroy{
  @Input() groupedBlocks: StoryBlock[];
  @Input() frame: StoryEditorFrame;
  @Input() isInteractiveVoiceResponseModule: boolean;
  
  private _sBs = new SubSink();

  coordinates: Coordinate;

  filteredBlocks: StoryBlock[] = [];

  constructor(private dragService: DragDropService) {}

  ngOnInit() {
    this._sBs.sink = this.dragService.coord$.subscribe((position) => (this.coordinates = position));

    // Filter blocks based on the IVR module flag
    this.filterBlocks();

  }

  /** check icon type */
  // TODO: replace all non-svg icons with svg
  getIcon(icon: string) {
    const svgPath = icon.split('.').pop();
    return svgPath === 'svg';
  }

  /**
   * Responds to changes in @Input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['groupedBlocks'] || changes['isInteractiveVoiceResponseModule']) {
      this.filterBlocks();
    }
  }

  /**
   * Filters the available blocks based on the isInteractiveVoiceResponseModule flag.
   */
  filterBlocks() {
    console.log("grouped blocks flag", this.isInteractiveVoiceResponseModule);
    if (this.isInteractiveVoiceResponseModule) {
      // Only show TextMessage and QuestionBlock types for IVR
      this.filteredBlocks = this.groupedBlocks.filter(
        block =>
          block.type === StoryBlockTypes.TextMessage ||
          block.type === StoryBlockTypes.QuestionBlock
      );
    } else {
      // Show all blocks when IVR is not active
      this.filteredBlocks = [...this.groupedBlocks];
    }
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
      case StoryBlockTypes.AssessmentMicroAppBlock:
        this.frame.newBlock(StoryBlockTypes.AssessmentMicroAppBlock, coordinates);
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
