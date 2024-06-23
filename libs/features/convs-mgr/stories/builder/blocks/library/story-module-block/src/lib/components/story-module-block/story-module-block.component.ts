import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryModuleBlock, StoryModuleResult } from '@app/model/convs-mgr/stories/blocks/structural';

import { OptionInputFieldComponent } from '@app/features/convs-mgr/stories/builder/blocks/library/block-options';

const OUTPUT_NAME_CHAR_LIMIT = 20;

/**
 * A block representing another story.
 * 
 * Could be a:
 * - Child story
 * - Flow
 * - Coaching module
 */
@Component({
  selector: 'app-story-module-block',
  templateUrl: './story-module-block.component.html',
  styleUrls: ['./story-module-block.component.scss'],
})
export class StoryModuleBlockComponent implements OnInit 
{
  @ViewChildren('storyOutputs') storyOutputs: QueryList<OptionInputFieldComponent>;

  @Input() id: string;
  @Input() block: StoryBlock;
  @Input() storyModuleBlock: FormGroup;
  @Input() jsPlumb: BrowserJsPlumbInstance;

  questionOptions: FormGroup;

  type: StoryBlockTypes;
  questiontype = StoryBlockTypes.QuestionBlock;
  blockFormGroup: FormGroup;

  readonly outputNameCharLimit = OUTPUT_NAME_CHAR_LIMIT;

  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void 
  {
    const block = this.block as StoryModuleBlock;
    block.outputs?.forEach((option: StoryModuleResult) => 
    {
      const btn = {
        id: option.id,
        message: option.label,
      } as ButtonsBlockButton<StoryModuleResult>

      this.options.push(this.loadOutputs(btn));
    })
  }

  get options(): FormArray {
    return this.storyModuleBlock.controls['options'] as FormArray;
  }

  loadOutputs(option?: ButtonsBlockButton<any>)
  {
    const outputId = this.options.length + 1;

    return this._fb.group({
      id: [option?.id ?? `${this.id}-${outputId}`],
      message: [option?.message ?? `Output ${outputId}`],
      value: [option?.value ?? '']
    })
  }
}
