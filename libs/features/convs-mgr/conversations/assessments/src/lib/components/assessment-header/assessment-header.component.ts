import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-assessment-header',
  templateUrl: './assessment-header.component.html',
  styleUrls: ['./assessment-header.component.scss']
})
export class AssessmentHeaderComponent implements OnInit, OnDestroy 
{
  @Input() startTime: number;
  @Input() assessmentTitle: string;
  timeTaken$: Observable<number>;
  private intervalId: any;

  ngOnInit() {
    this.timeTaken$ = interval(1000).pipe(
      map(() => {
        const currentTime = Date.now();
        return currentTime - this.startTime;
      })
    );
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
