import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Timestamp } from '@firebase/firestore-types';

import { SubSink } from 'subsink';
import { combineLatest, map, of, tap } from 'rxjs';

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
  isLoading: boolean;
  showLessons: Record<string, boolean> = {};

  leanerProgress: EnrolledUserProgress[];

  private _sBs = new SubSink();

  @Input() currentLearner: EnrolledEndUser;

  constructor(
    private _lessonStateService$: StoryStateService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._sBs.sink = this.getLearnerProgress().subscribe((progresss) => {
      this.leanerProgress = progresss;
      this.initializeShowLessons();
    });
  }

  private initializeShowLessons(): void {
    this.leanerProgress.map((course) => {
      course.modules.map((module) => {
        if (module.name) {
          this.showLessons[module.name] = false;
        }
      });
    });
  }

  openModule(parentBot: string, id: string) {
    this._router.navigate(['bots', parentBot, 'modules', id]);
  }

  toggleLessons(moduleId: string) {
    this.showLessons[moduleId] = !this.showLessons[moduleId];
  }

  /** gets the learner progress */
  getLearnerProgress() {
    this.isLoading = true;

    if (!this.currentLearner.courses) {
      this.isLoading = false;
      return of([]);
    }

    const progress = this.currentLearner.courses.map((course) =>
      combineLatest(
        course.modules.map((usrProgModule) =>
          this.computeProgressAtModuleLevel(usrProgModule)
        )
      ).pipe(
        map((modules) => ({
          id: course.courseId,
          name: course.courseName,
          enrollmentDate: (course.enrollmentDate as Timestamp).toDate(),
          modules: modules,
        }))
      )
    );

    return combineLatest(progress).pipe(tap(() => (this.isLoading = false)));
  }

  /** computes learner progress per module (lessons covered) */
  computeProgressAtModuleLevel(userProgModule: EnrolledUserBotModule) {
    return combineLatest(
      userProgModule.lessons.map((lesson) =>
        this.computeLearnerProgress(lesson)
      )
    ).pipe(
      map((lessons) => ({
        id: userProgModule.moduleId,
        name: userProgModule.moduleName,
        lessons,
      }))
    );
  }

  /** computes leaner progress per lesson(blocks covered) */
  computeLearnerProgress(lessonProg: EnrolledUserLesson) {
    return this._lessonStateService$.getStoryById(lessonProg.lessonId).pipe(
      map((story) => {
        const totalBlocks = story?.blocksCount ? story.blocksCount - 2 : 0; // subtract start and end anchor
        const blockedPassed = lessonProg?.blocks?.length ?? 0;
        const percentage =
          totalBlocks === 0 ? 0 : (blockedPassed / totalBlocks) * 100;

        return {
          name: story?.name ?? story?.id,
          progress: Math.round(percentage),
        };
      })
    );
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
