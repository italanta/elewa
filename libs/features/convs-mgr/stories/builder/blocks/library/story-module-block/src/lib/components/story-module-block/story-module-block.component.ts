import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { of, switchMap, take, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';
import { StoryModuleBlock, StoryModuleResult, StoryModuleTypes } from '@app/model/convs-mgr/stories/blocks/structural';

import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { OptionInputFieldComponent } from '@app/features/convs-mgr/stories/builder/blocks/library/block-options';

import { CreateModuleModalComponent } from '../create-module-modal/create-module-modal.component';

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

  // Case - Create modal fails. Cleanup self
  @Output() undoCreate: EventEmitter<boolean> = new EventEmitter();

  questionOptions: FormGroup;

  type: StoryBlockTypes;
  questiontype = StoryBlockTypes.QuestionBlock;

  readonly outputNameCharLimit = OUTPUT_NAME_CHAR_LIMIT;

  constructor(private _fb: FormBuilder,
              private _dialog: MatDialog,
              private _blocks$$: StoryBlocksStore,
              private _router: Router) 
  { }

  ngOnInit(): void 
  {
    const block = this.block as StoryModuleBlock;
    if(block?.storyType == null)
      this._loadInCreateMode();
  }

  /**
   * Case I. The Story does not yet
   */
  private _loadInCreateMode()
  {
    const dialog = this._dialog.open(CreateModuleModalComponent, 
                                     { data: { blockId: this.block.id }});
    this._sbS.sink =
      dialog.afterClosed()
        .pipe(take(1),
              tap(
          (res: Story | false) =>
          {
            if(res)
            {
              const block = this.block as StoryModuleBlock;
              block.blockTitle = `Module: ${res.name}`;
              this.storyModuleBlock.get('type')?.setValue(res.type);
              block.storyType = res.type as StoryModuleTypes;
              this.storyModuleBlock.get('name')?.setValue(res.name);
              block.outputs = [ { id: `${block.id}_0`, label: 'BOTS.SUBSTORY-BLOCK.DEF-OUTPUT' }];
            }
            return res;
          }
        ), 
        // WARN! We always immediately persist the block here.
        //    UX research has shown that a common pattern is to immediately navigate to the child upon creation.
        //    This is therefore an exception that slightly breaks the save architecture
        switchMap((res) => res ? this._blocks$$.add(this.block, this.block.id) : of(false)))
    .subscribe((bl) =>
    {   
      if(bl)
        this.options.push(this._loadOutput((bl as StoryModuleBlock).outputs[0])) 
      else
        this.undoCreate.emit(true);
    });
  }

  /**
   * Navigate to the child story.
   */
  navigateToStory()
  {
    this._router.navigate(['stories', this.block.id]);
  }

  get options(): FormArray {
    return this.storyModuleBlock.controls['options'] as FormArray;
  }

  /** Load a block output record */
  private _loadOutput(option: StoryModuleResult)
  {
    const btn = {
      id: option.id,
      message: option.label,
      value: option.id,
    } as ButtonsBlockButton<StoryModuleResult>

    const outputId = this.options.length + 1;

    return this._fb.group({
      id: [btn?.id ?? `${this.id}-${outputId}`],
      message: [btn?.message ?? `Output ${outputId}`],
      value: [btn?.value ?? '']
    })
  }
}
