import { Component, Input } from '@angular/core';

import { map } from 'rxjs';

import { BotsStateService } from '@app/state/convs-mgr/bots';
import { BotModulesStateService } from '@app/state/convs-mgr/modules';

import { EnrolledUserBotModule } from 'libs/model/convs-mgr/learners/src/lib/enrolled-user-courses.interface';
import { EnrolledEndUser } from '@app/model/convs-mgr/learners';
import { BotModule } from '@app/model/convs-mgr/bot-modules';

@Component({
  selector: 'app-learner-enrolled-courses',
  templateUrl: './learner-enrolled-courses.component.html',
  styleUrls: ['./learner-enrolled-courses.component.scss'],
})
export class LearnerEnrolledCoursesComponent {
  isOpen = false;

  @Input() currentLearner: EnrolledEndUser;

  constructor(
    private _botsStateServ$: BotsStateService,
    private _botModStateServ$: BotModulesStateService
  ) {}

  toggleCollapsible() {
    return (this.isOpen = !this.isOpen);
  }

  /**  */
  getLearnerProgress() {
    return this.currentLearner.courses?.map((course) =>
      this._botsStateServ$.getBotById(course.courseId).pipe(
        map((bot) => {
          return {
            name: bot?.name,
            modules: course.modules.map((usrProgModule) =>
              this.computeLearnerProgress(usrProgModule)
            ),
          };
        })
      )
    );
  }

  /**  */
  computeLearnerProgress(userprogModule: EnrolledUserBotModule) {
    return this._botModStateServ$
      .getBotModuleById(userprogModule.moduleId).pipe(
        map((mod) => {
          const totalLessons = (mod as BotModule)?.stories.length | 0;
          const lessonsTaken = userprogModule.lessons.length;
          const percentage = totalLessons === 0 ? 0 : (lessonsTaken / totalLessons) * 100;

          return {
            name: mod?.name,
            progress: Math.round(percentage),
          };
        })
      );
  }
}
