import { Pipe, PipeTransform } from '@angular/core';
import { Course } from '@app/model/convs-mgr/bots';
import { Observable, combineLatest, map, startWith } from 'rxjs';


@Pipe({
  name: 'filterCourse'
})
export class FilterCoursePipe implements PipeTransform {

  transform(courses$: Observable<Course[]>, filterString$: Observable<string>) {
    const filter$ = filterString$.pipe(startWith(''));

    return combineLatest([filter$, courses$]).pipe(
      map(([filter, course]) => this.filterChatList(filter, course))
    );
  }

  private filterChatList(filterValue: string, courses: Course[]) {
    return courses.filter(
      (course: Course) => course.bot.name?.toLowerCase().includes(filterValue.toLowerCase()) 
    );
  }
}
