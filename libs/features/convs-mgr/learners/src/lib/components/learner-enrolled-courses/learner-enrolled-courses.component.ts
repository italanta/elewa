import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { Observable, combineLatest, map, switchMap, tap } from 'rxjs';

import { BotsStateService } from '@app/state/convs-mgr/bots';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';
import { StoryStateService } from '@app/state/convs-mgr/stories';

import {
  EnrolledEndUser,
  EnrolledUserLesson,
} from '@app/model/convs-mgr/learners';
import { EnrolledUserBotModule } from '@app/model/convs-mgr/learners';

import { EnrolledUserProgress } from '../../models/enrolled-user-progress.interface';
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

@Component({
  selector: 'app-learner-enrolled-courses',
  templateUrl: './learner-enrolled-courses.component.html',
  styleUrls: ['./learner-enrolled-courses.component.scss'],
})
export class LearnerEnrolledCoursesComponent implements OnInit, OnDestroy {
  isOpen = false;
  isLoading: boolean;

  leanerProgress: Observable<EnrolledUserProgress>[];

  private _sBs = new SubSink();

  @Input() currentLearner: EnrolledEndUser;

  constructor(
    private _botsStateServ$: BotsStateService,
    private _botModStateServ$: BotModulesStateService,
    private _lessonStateService$: StoryStateService,
    private _blocksStateService$: StoryBlocksStore
  ) {}

  ngOnInit(): void {
    this.leanerProgress = this.getLearnerProgress();

    this.leanerProgress.map((each) => {
      each.subscribe((v) => console.log(v))
    })
  }

  toggleCollapsible() {
    return (this.isOpen = !this.isOpen);
  }

  /** gets the learner progress */
  getLearnerProgress() {
    this.isLoading = true;
  
    if (!this.currentLearner.courses) {
      return [];
    }

    return this.currentLearner.courses.map((course) =>
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
            console.log({blocks})
            const totalBlocks = blocks.length ? blocks.length - 2 : 0;
            const blockedPassed = userprogModule?.blocks?.length ?? 0;
            const percentage = totalBlocks === 0 ? 0 : (blockedPassed / totalBlocks) * 100;

            return {
              name: story?.name ?? story?.id,
              progress: Math.round(percentage),
            };
          })
         
        )
      ),
      tap(() => this.isLoading = false)
    );
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
