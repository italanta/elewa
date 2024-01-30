import { Component, Input } from '@angular/core';

import { Periodicals } from '@app/model/analytics/group-based/progress';
import { Bot } from '@app/model/convs-mgr/bots';
import { Classroom } from '@app/model/convs-mgr/classroom';

@Component({
  selector: 'app-single-course-page',
  templateUrl: './single-course-page.component.html',
  styleUrls: ['./single-course-page.component.scss'],
})
export class SingleCoursePageComponent {
  @Input() periodical: Periodicals;
  @Input() activeCourse: Bot;
  @Input() activeClassroom: Classroom;
}
