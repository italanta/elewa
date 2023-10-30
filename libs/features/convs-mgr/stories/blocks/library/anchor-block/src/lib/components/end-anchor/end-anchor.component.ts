import { AfterViewInit, ChangeDetectorRef,ComponentRef, Component, Input, ViewContainerRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { BlockComponent, BlockInjectorService } from '@app/features/convs-mgr/stories/blocks/library/main';
import { BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';

import { _JsPlumbTargetLeftComponentDecorator } from '../../providers/jsplumb-target-decorator.function';
import { _CreateEndStoryAnchorBlockForm } from '../../../../../main/src/lib/model/end-story-anchor-block-form.model';

@Component({
  selector: 'app-end-anchor',
  templateUrl: './end-anchor.component.html',
  styleUrls: ['./end-anchor.component.scss'],
})
export class EndAnchorComponent implements AfterViewInit, OnInit {
  @Input() id: string;
  @Input() block: EndStoryAnchorBlock;
  @Input() endStoryAnchorForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() blocksGroup: FormArray;
  @Input() viewPort: ViewContainerRef;
  type: StoryBlockTypes;
  
  ref: ComponentRef<BlockComponent>;

  endAnchorId = 'story-end-anchor';
  blockFormGroup: FormGroup;
  endStoryAnchor = StoryBlockTypes.EndStoryAnchorBlock;

  constructor(
    private _blockInjectorService: BlockInjectorService,
    private _connectionsService: BlockConnectionsService,
    private _cd:ChangeDetectorRef,
    private _fb: FormBuilder,
) { }

  ngOnInit(): void {
    if (this.blocksGroup && this.type === StoryBlockTypes.EndStoryAnchorBlock) {
      this.blockFormGroup = _CreateEndStoryAnchorBlockForm(this._fb, this.block);
      this.blocksGroup.push(this.blockFormGroup);
    }
  }
  ngAfterViewInit(): void {
    this._decorateInput();
  }

  private _decorateInput() {
    const input = document.getElementById(this.id) as Element;

    if (this.jsPlumb) {
      _JsPlumbTargetLeftComponentDecorator(input, this.jsPlumb);
    }
  }

  copyblock(block: StoryBlock) {
    console.log("block",this.blocksGroup)
    block.id = (this.blocksGroup.value.length + 1).toString();
    block.position.x = block.position.x + 300;
    delete block.createdBy;
    delete block.createdOn;
    delete block.updatedOn;

    this._blockInjectorService.newBlock(block, this.jsPlumb, this.viewPort, this.blocksGroup);
  }


  deleteBlock() {
    this.block.deleted = true;
    this.blockFormGroup.value.deleted = true;
    this._connectionsService.deleteBlockConnections(this.block);
    const index = this.viewPort.indexOf(this.ref.hostView);
    this.viewPort.remove(index);
    // this._cd.detectChanges();
  }
}
