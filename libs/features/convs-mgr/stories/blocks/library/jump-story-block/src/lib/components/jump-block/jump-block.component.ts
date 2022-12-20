import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { JumpBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '@app/features/convs-mgr/stories/blocks/library/block-options';
import { Story } from '@app/model/convs-mgr/stories/main';
import { StoriesStore } from '@app/state/convs-mgr/stories';
import { StoryEditorState, StoryEditorStateService } from '@app/state/convs-mgr/story-editor';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';


/**
 * Block which sends a message from bot to user.
 */
@Component({
  selector: 'app-jump-block',
  templateUrl: './jump-block.component.html',
  styleUrls: ['./jump-block.component.scss']
})
export class JumpBlockComponent implements OnInit, OnDestroy
{
  @Input() id: string;
  @Input() block: JumpBlock;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() jumpBlockForm: FormGroup

  @Input() blocksGroup: FormArray;

  _sBS = new SubSink();
 
  stories: Story[];
  selectedStory: string;
  blocks: StoryBlock[];

  transloco: string;
  type: StoryBlockTypes;
  messagetype = StoryBlockTypes.JumpBlock;
  blockFormGroup: FormGroup;

  constructor(private _stories$$: StoriesStore,
              private _storyEditorStateService$$: StoryEditorStateService,
              private _storyBlockStore$$: StoryBlocksStore,
              private _fb: FormBuilder,
              private _logger: Logger)
  { }
  
  ngOnInit(): void {
    if(this.jsPlumb) {
      this._decorateElement();
    }
    this.getStories();
  }

  private _decorateElement(){
    const element = document.getElementById(this.id) as Element;
    if(this.jsPlumb) {
      _JsPlumbComponentDecorator(element, this.jsPlumb);
    }
  }

  getStories() {
    this._sBS.sink = this._stories$$.get().subscribe((stories: Story[])=> {
      this.stories = stories;
    })
  }

  getBlocks() {
    const storyId = this.jumpBlockForm.value.storyId

    this._sBS.sink = this._storyBlockStore$$.getBlocksByStory(storyId).subscribe((blocks: StoryBlock[])=>{
        this.blocks = blocks
    })
  }

  ngOnDestroy() {
    this._sBS.unsubscribe();
  }
}
