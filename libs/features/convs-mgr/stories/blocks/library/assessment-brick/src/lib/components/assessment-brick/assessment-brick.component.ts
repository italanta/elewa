import { Component, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { AssessmentBrick } from '@app/model/convs-mgr/stories/blocks/messaging';

import { _JsPlumbComponentDecorator } from '../../providers/decorate-jsplumb.provider';


@Component({
  selector: 'app-assessment-brick',
  templateUrl: './assessment-brick.component.html',
  styleUrls: ['./assessment-brick.component.scss'],
})


export class AssessmentBrickComponent
{

  @Input() id: string;
  @Input() block: AssessmentBrick;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  @Input() assessmentBrickForm: FormGroup

  @Input() blocksGroup: FormArray;
 
  type: StoryBlockTypes;
  assessmentBrickType = StoryBlockTypes.Assessment;
  blockFormGroup: FormGroup;

  ngAfterViewInit(): void {
    this._decorateInput();
  }

  /** Add JsPlumb connector to max score input */
  private _decorateInput() {
    let inputs = document.getElementsByClassName('input-score-max');
    if (this.jsPlumb) {
      for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i]
        input = _JsPlumbComponentDecorator(input, this.jsPlumb)
      }
    }
  }

  get scores(): FormArray {
    return this.assessmentBrickForm.controls['scoreOptions'] as FormArray
  }
}
