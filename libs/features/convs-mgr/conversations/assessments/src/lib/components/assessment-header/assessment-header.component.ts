import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { UpdateElapsedTime } from '../../utils/get-elapsed-time.util';

@Component({
  selector: 'app-assessment-header',
  templateUrl: './assessment-header.component.html',
  styleUrls: ['./assessment-header.component.scss']
})
export class AssessmentHeaderComponent implements OnInit, OnDestroy 
{
  @Input() startTime: number;
  @Input() assessmentTitle: string;
  elapsedTime: string;
  private intervalId: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.elapsedTime = UpdateElapsedTime(this.startTime);
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
