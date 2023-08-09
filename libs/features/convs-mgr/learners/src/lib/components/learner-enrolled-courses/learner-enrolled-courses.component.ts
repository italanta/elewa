import { Component } from '@angular/core';

@Component({
  selector: 'app-learner-enrolled-courses',
  templateUrl: './learner-enrolled-courses.component.html',
  styleUrls: ['./learner-enrolled-courses.component.scss'],
})
export class LearnerEnrolledCoursesComponent {
  isOpen = false;

  toggleCollapsible() {
    return this.isOpen = !this.isOpen;
  }
}
