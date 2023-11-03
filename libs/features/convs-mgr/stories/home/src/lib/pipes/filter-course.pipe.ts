import { Pipe, PipeTransform } from '@angular/core';
import { Observable, combineLatest, map, startWith } from 'rxjs';
import { Course } from '../model/courses.interface';

@Pipe({
  name: 'filterCourse'
})
export class FilterCoursePipe implements PipeTransform {

  transform(courses$: Observable<Course>, filterString$: Observable<string>) {
    const filter$ = filterString$.pipe(startWith(''));

    return combineLatest([filter$, courses$]).pipe(
      map(([filter, course]) => this.filterChatList(filter, course))
    );
  }

  private filterChatList(filterValue: string, course: Course) {
    return course.filter(
      (course) => course.bot.name?.toLowerCase().includes(filterValue.toLowerCase()) 
    );
  }
}
