import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { EndStoryAnchorBlock } from '@app/model/convs-mgr/stories/blocks/structural';

import { _JsPlumbTargetLeftComponentDecorator } from '../../providers/jsplumb-target-decorator.function';


/**
 * The end anchor determines the 
 */
@Component({
  selector: 'app-end-anchor',
  templateUrl: './end-anchor.component.html',
  styleUrls: ['./end-anchor.component.scss'],
})
export class EndAnchorComponent implements OnInit, AfterViewInit 
{
  @Input() id: string;
  @Input() block: StoryBlock;
  typedBlock: EndStoryAnchorBlock;
  @Input() endStoryAnchorForm: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;
  @Input() showDeleteButton = true; 

  @Output() deleteButtonClick: EventEmitter<void> = new EventEmitter<void>();

  alternativeOutputsF: FormGroup;

  endAnchorId = 'story-end-anchor';
  isEditSection = false;


  ngOnInit()
  {
    this.typedBlock = this.block as EndStoryAnchorBlock;
  }

  ngAfterViewInit(): void 
  {
    // Decorate input
    const input = document.getElementById(this.id) as Element;
    if (this.jsPlumb) {
      _JsPlumbTargetLeftComponentDecorator(input, this.jsPlumb);
    }
  }


  get outputs(): FormArray {
    return this.endStoryAnchorForm.controls['outputs'] as FormArray;
  }

  /** Block delete -> Possible? */
  deleteMe() {
    this.deleteButtonClick.emit();
  }
}
