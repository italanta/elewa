import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { combineLatest, map, of, switchMap, tap } from 'rxjs';

import { BotsStateService } from '@app/state/convs-mgr/bots';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { StoryStateService } from '@app/state/convs-mgr/stories';

import {
  EnrolledEndUser,
  EnrolledUserLesson,
} from '@app/model/convs-mgr/learners';
import { EnrolledUserBotModule } from '@app/model/convs-mgr/learners';

import { EnrolledUserProgress } from '../../models/enrolled-user-progress.interface';

@Component({
  selector: 'app-learner-enrolled-courses',
  templateUrl: './learner-enrolled-courses.component.html',
  styleUrls: ['./learner-enrolled-courses.component.scss'],
})
export class LearnerEnrolledCoursesComponent implements OnInit, OnDestroy {
  isOpen = false;
  isLoading: boolean;

  leanerProgress: EnrolledUserProgress[];

  private _sBs = new SubSink();

  @Input() currentLearner: EnrolledEndUser;

  constructor(
    private _botsStateServ$: BotsStateService,
    private _botModStateServ$: BotModulesStateService,
    private _lessonStateService$: StoryStateService,
    private _blocksStateService$: StoryBlocksStore
  ) {}

  ngOnInit(): void {
    this._sBs.sink = this.getLearnerProgress().subscribe((progresss) =>{
      this.leanerProgress = progresss
    });
  }

  toggleCollapsible() {
    return (this.isOpen = !this.isOpen);
  }

  /** gets the learner progress */
  getLearnerProgress() {
    this.isLoading = true;
  
    if (!this.currentLearner.courses) {
      return of([]);
    }

    const progress = this.currentLearner.courses.map((course) =>
      this._botsStateServ$.getBotById(course.courseId).pipe(
        switchMap((bot) =>
          combineLatest(
            course.modules.map((usrProgModule) => this.computeProgressAtModuleLevel(usrProgModule))
          ).pipe(
            map((modules) => ({
              name: bot?.name ?? bot?.id,
              modules: modules,
            }))
          )
        )
      )
    );

    return combineLatest(progress).pipe(tap(() => this.isLoading = false))
  }

  /** computes learner progress per module (lessons covered) */
  computeProgressAtModuleLevel(userProgModule: EnrolledUserBotModule) {
    return combineLatest(
      userProgModule.lessons.map((lesson) => this.computeLearnerProgress(lesson))
    ).pipe(
      switchMap((lessons) =>
        this._botModStateServ$.getBotModuleById(userProgModule.moduleId).pipe(
          map((mod) => ({
            name: mod?.name ?? mod?.id,
            lessons: lessons,
          }))
        )
      )
    );
  }

  /** computes leaner progress per lesson(blocks covered) */
  computeLearnerProgress(userprogModule: EnrolledUserLesson) {
    return this._lessonStateService$.getStoryById(userprogModule.lessonId).pipe(
      switchMap((story) =>
        this._blocksStateService$.getBlocksByStory(story?.id as string, story?.orgId).pipe(
          map((blocks) => {
            const totalBlocks = blocks.length ? blocks.length - 2 : 0;
            const blockedPassed = userprogModule?.blocks?.length ?? 0;
            const percentage = totalBlocks === 0 ? 0 : (blockedPassed / totalBlocks) * 100;

            return {
              name: story?.name ?? story?.id,
              progress: Math.round(percentage),
            };
          })
        )
      )
    );
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
