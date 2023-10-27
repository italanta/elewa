import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

import { Observable, map } from 'rxjs';
import { SubSink } from 'subsink';

import { EventBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';
import { Story } from '@app/model/convs-mgr/stories/main';

import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { StoriesStore } from '@app/state/convs-mgr/stories';

@Component({
  selector: 'app-milestone-reached-modal',
  templateUrl: './milestone-reached-modal.component.html',
  styleUrls: ['./milestone-reached-modal.component.scss'],
})
export class MilestoneReachedModalComponent implements OnInit, OnDestroy{
  @Output() milestoneSelected = new EventEmitter<{
    selectedStory: Story;
    selectedMilestone: EventBlock;
  }>();

  stories$: Observable<Story[]>;
  story: Story;
  blocks$: Observable<StoryBlock[]>;
  _sBS: SubSink;
  action: string;

  selectedMilestone: EventBlock; 

  constructor(
    private _stories$$: StoriesStore,
    private _dialog: Dialog,
    private _storyBlockStore: StoryBlocksStore,
    private _route$$: Router
  ) {
    this.stories$ = this._stories$$.get();
  }

  ngOnInit(): void {
    this.action = this._route$$.url.split('/')[2];
  }

  selectedBot() {
    const storyId = this.story.id!;
    this.blocks$ = this._storyBlockStore
      .getBlocksByStory(storyId, this.story.orgId)
      .pipe(
        map((b) => b.filter((block) => block.type === 30)),
        map((b) => b.filter((block: EventBlock) => block.isMilestone))
      );
  }

  onSaveClick() {
    const selectedStory = this.story;
    const selectedMilestone = this.selectedMilestone;

    this.milestoneSelected.emit({
      selectedStory,
      selectedMilestone,
    });
    this._dialog.closeAll(); // Close the modal
  }
  closeModal(){
    this._dialog.closeAll();
  }
  ngOnDestroy(): void {
      // this._sBS.unsubscribe();
  }
}
