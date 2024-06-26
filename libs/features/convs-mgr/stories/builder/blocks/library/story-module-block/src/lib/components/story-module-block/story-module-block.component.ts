import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryModuleBlock, StoryModuleResult, StoryModuleTypes } from '@app/model/convs-mgr/stories/blocks/structural';

import { OptionInputFieldComponent } from '@app/features/convs-mgr/stories/builder/blocks/library/block-options';
import { MatDialog } from '@angular/material/dialog';
import { CreateModuleModalComponent } from '../create-module-modal/create-module-modal.component';
import { SubSink } from 'subsink';
import { CreateStoryModuleForm } from '../create-module-modal/create-module-form';

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
  private _sbS = new SubSink();
  
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

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog) 
  { }

  ngOnInit(): void 
  { 
    const block = this.block as StoryModuleBlock;
    if(block?.storyType == null)
      this._loadInCreateMode();
    else
      this._loadInExistsMode();

    // block.outputs?.forEach((option: StoryModuleResult) => 
    // {
    //     const btn = {
    //       id: option.id,
    //       message: option.label,
    //     } as ButtonsBlockButton<StoryModuleResult>
  
    //     this.options.push(this.loadOutputs(btn));
    // })
  }

  /**
   * Case I. The Story does not yet
   */
  private _loadInCreateMode()
  {
    const dialog = this._dialog.open(CreateModuleModalComponent);

    this._sbS.sink =
      dialog.afterClosed()
        .subscribe(
          (res: CreateStoryModuleForm | false) =>
          {
            if(res)
            {
              const block = this.block as StoryModuleBlock;
              block.blockTitle = `Module: ${res.name}`;
              this.blockFormGroup.get('type')?.setValue(res.type);
              block.storyType = res.type;
              this.blockFormGroup.get('name')?.setValue(res.name);
            }
          }
      );
  }

  /**
   * Case II. The Story already exists
   */
  private _loadInExistsMode()
  {

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
