import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { SubSink } from 'subsink';

import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';

import { Logger } from '@iote/bricks-angular';
import { TranslateService } from '@ngfi/multi-lang';

import { StoriesStore } from '@app/state/convs-mgr/stories';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { JumpBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Story } from '@app/model/convs-mgr/stories/main';

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

  @Input() jumpBlockForm: FormGroup;

  @Input() blocksGroup: FormArray;

  _sBS = new SubSink();

  stories: Story[];
  blocks: StoryBlock[];

  optionClass: string;
  jumpBlockOptions: any[];

  type: StoryBlockTypes;
  jumpType = StoryBlockTypes.JumpBlock;
  blockFormGroup: FormGroup;

  constructor(private _stories$$: StoriesStore,
    private _fb: FormBuilder,
    private _storyBlockStore$$: StoryBlocksStore,
    private _translate: TranslateService,
    private _logger: Logger)
  { }

  ngOnInit(): void
  {
    this.setJumpBlockOptions();

    this.getStories();
  }

  get options(): FormArray
  {
    return this.jumpBlockForm.controls['options'] as FormArray;
  }

  addJumpOptions(option?: any)
  {
    return this._fb.group({
      id: [option?.id ?? `${this.id}-${this.options.length + 1}`],
      message: [option?.message ?? ''],
      value: [option?.value ?? '']
    });
  }

  setJumpBlockOptions()
  {
    this.jumpBlockOptions = [{
      message: this._translate.translate("PAGE-CONTENT.BLOCK.BUTTONS.JUMP-BLOCK.SUCCESS"),
      value: "success"
    },
    {
      message: this._translate.translate("PAGE-CONTENT.BLOCK.BUTTONS.JUMP-BLOCK.FAILED"),
      value: "failed"
    }

    ];

    this.jumpBlockOptions.forEach((option) =>
    {
      this.options.push(this.addJumpOptions(option));
    });
  }

  getStories()
  {
    this._sBS.sink = this._stories$$.get()
      .subscribe((stories: Story[]) =>
      {
        this.stories = stories;
      });
  }

  ngOnDestroy()
  {
    this._sBS.unsubscribe();
  }
}
