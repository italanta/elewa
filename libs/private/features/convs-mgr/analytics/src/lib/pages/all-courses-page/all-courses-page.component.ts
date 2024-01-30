import { Component, Input } from '@angular/core';

import { Periodicals } from '@app/model/analytics/group-based/progress';

@Component({
  selector: 'app-all-courses-page',
  templateUrl: './all-courses-page.component.html',
  styleUrls: ['./all-courses-page.component.scss'],
})
export class AllCoursesPageComponent {
  @Input() periodical: Periodicals;
}
