import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Bot } from '@app/model/convs-mgr/bots';
import { Story } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'italanta-apps-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent {
  @Input() courses$: Observable<
    {
      bot: Bot;
      modules$: Observable<
        {
          module: BotModule;
          stories$: Observable<Story[]>;
        }[]
      >;
    }[]
  >;
}
