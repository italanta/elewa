import { AfterViewInit, ChangeDetectorRef,ComponentRef, Component, Input, ViewContainerRef, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { switchMap, tap } from 'rxjs';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import {  StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { BlockComponent } from '@app/features/convs-mgr/stories/blocks/library/main';
import { BlockConnectionsService } from '@app/state/convs-mgr/stories/block-connections';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

import { _JsPlumbTargetLeftComponentDecorator } from '../../providers/jsplumb-target-decorator.function';
import { _CreateEndStoryAnchorBlockForm } from '../../../../../main/src/lib/model/end-story-anchor-block-form.model';



@Component({
  selector: 'app-end-anchor',
  templateUrl: './end-anchor.component.html',
  styleUrls: ['./end-anchor.component.scss'],
})
export class EndAnchorComponent implements AfterViewInit{
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
    private _connectionsService: BlockConnectionsService,
    private _blocks$$: StoryBlocksStore,
    private _fb: FormBuilder,
) { }


  ngAfterViewInit(): void {
    this._decorateInput();
    if (this.blocksGroup && this.type === StoryBlockTypes.EndStoryAnchorBlock) {
      this.blockFormGroup = _CreateEndStoryAnchorBlockForm(this._fb, this.block);
      this.blocksGroup.push(this.blockFormGroup);
    }
  }

  private _decorateInput() {
    const input = document.getElementById(this.id) as Element;

    if (this.jsPlumb) {
      _JsPlumbTargetLeftComponentDecorator(input, this.jsPlumb);
    }
  }

  deleteBlock() {
     this._blocks$$.remove(this.block).pipe(
      switchMap(async () => this.removeBlockAndConnections())
    ).subscribe();

  }
  removeBlockAndConnections(){
    this._connectionsService.deleteBlockConnections(this.block);
    console.log("ref",this.ref.hostView);
    const index = this.viewPort.indexOf(this.ref.hostView);
    this.viewPort.remove(index);
  }
}
