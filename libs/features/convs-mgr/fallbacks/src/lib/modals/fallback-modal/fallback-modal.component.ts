import * as _ from "lodash";

import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot } from '@app/model/convs-mgr/bots';

import { ActionTypesArray, Fallback } from '@app/model/convs-mgr/fallbacks';
import { Story } from '@app/model/convs-mgr/stories/main';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { StoryStateService } from '@app/state/convs-mgr/stories';
import { Observable, switchMap } from 'rxjs';
import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";
import { StoryBlocksStore } from "@app/state/convs-mgr/stories/blocks";
import { ActiveOrgStore } from "@app/private/state/organisation/main";
@Component({
  selector: 'app-fallback-modal',
  templateUrl: './fallback-modal.component.html',
  styleUrls: ['./fallback-modal.component.scss'],
})
export class FallbackModalComponent implements OnInit {

  actionTypes = ActionTypesArray;
  fallbackForm: FormGroup;
  fallback: Fallback;
  bot: Bot;
  modules$: Observable<BotModule[]>;
  stories$: Observable<Story[]> | undefined;
  stories: Story[] = [];
  allStories: Story[] = [];
  blocks: StoryBlock [] = [];
  blocks$:Observable<StoryBlock[]> | undefined
  
  constructor(public dialogRef: MatDialogRef<FallbackModalComponent>, 
              private fb: FormBuilder,
              private _botModuleService: BotModulesStateService, 
              private _storiesService: StoryStateService, 
              private _blockService: StoryBlocksStore, 
              private _activeOrgStore$$: ActiveOrgStore,
              @Inject(MAT_DIALOG_DATA) public data: { fallback: Fallback, bot: Bot}
            ) {
              if(this.data) {
                this.fallback = this.data.fallback;
                this.bot = this.data.bot;
              };
            }

  ngOnInit(): void {
    if(this.data && this.data.bot && this.bot.id) {
      this.modules$ = this._botModuleService.getBotModulesFromParentBot(this.bot.id as string);
    }
    
    this.buildForm();
    this.populateForm(this.fallback);

    this._storiesService.getStories().subscribe((str) => {
      this.allStories = str
      if(this.moduleId?.value && this.allStories) {
        this.setStories(this.moduleId?.value);
      }
    });
    this.blocks$ = this.getBlocks();
    // this.setBlocks(this.storyId?.value);
  }

  setStories(module: any) {
    this.stories = this.allStories.filter((story)=> story.parentModule === module);
    this.block?.patchValue('');
  }

  getBlocks() {
    const org$ = this._activeOrgStore$$.get();

    return this.storyId?.valueChanges.pipe(switchMap((storyId)=> org$.pipe((switchMap((org)=> this._blockService.getBlocksByStory(storyId, org.id))))))
    
  }

  setBlocks(storyId: any) {
    const org$ = this._activeOrgStore$$.get();

    org$.pipe((switchMap((org)=> this._blockService.getBlocksByStory(storyId, org.id))))
      .subscribe((blocks)=> {
        this.blocks = blocks.filter((bl)=> bl.id !== 'story-end-anchor')
      })
  }

  get block() {
    return this.fallbackForm.get('actionDetails.block');
  }

  get moduleId() {
    return this.fallbackForm.get('actionDetails.moduleId');
  }

  get storyId() {
    return this.fallbackForm.get('actionDetails.storyId');
  }


  buildForm(): void {
    this.fallbackForm = this.fb.group({
      userInput: this.fb.array([]),
      actionsType: ['', Validators.required],
      actionDetails: this.fb.group({
        description: [''],
        storyId: [''],
        block: [''],
        moduleId: ['', Validators.required],
      }),
      moduleId: ['', Validators.required],
      active: [false],
    });
  }

  populateForm(fallback: any) {
    if(!fallback) return;

    this.fallbackForm.patchValue({
      actionsType: fallback.actionsType,
      actionDetails: {
        description: fallback.actionDetails?.description || '',
        storyId: fallback.actionDetails.storyId || '',
        block: fallback.actionDetails.block.id || '',
        moduleId: fallback.moduleId || ''
      },
      botId: this.bot.id,
      moduleId: fallback.moduleId,
      active: fallback.active
    });

    if(fallback.userInput && fallback.userInput.length > 0) {
      fallback.userInput.forEach((input: any)=> this.addUserInput(input));
    }
  }

  get userInput(): FormArray{
    return this.fallbackForm.get('userInput') as FormArray;
  }

  createUserInputControl(): FormGroup {
    return this.fb.group({
      userInput: ['', Validators.required]
    });
  }

  addUserInput(input: string): void {
    this.userInput.push(this.fb.control(input));
  }

  removeUserInput(index: number): void {
    this.userInput.removeAt(index);
  }
}
