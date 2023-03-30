import { Chart } from 'chart.js';

import {Component, OnInit, Input } from '@angular/core';


import { QuestionMessage } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-group-based-progress-chart',
  templateUrl: './group-based-progress-chart.component.html',
  styleUrls:  ['./group-based-progress-chart.component.scss'],
})
export class GroupBasedProgressChartComponent implements OnInit
{
  @Input() model: QuestionMessage;

  @Input() chart: Chart;


  ngOnInit() 
  { 
    this.chart = this._loadChart();
  }

  private _loadChart(): Chart 
  {
    return new Chart('chart-ctx', {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],

        datasets: []
      }
    });
  }

}
