import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AssessmentResult, BarChartData } from '@app/model/convs-mgr/micro-app/assessments';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-distribution-bar-chart',
  templateUrl: './distribution-bar-chart.component.html',
  styleUrls: ['./distribution-bar-chart.component.scss'],
})
export class DistributionBarChartComponent implements OnInit, AfterViewInit {
  @ViewChild('distributionScoreChart') distributionScoreChart: ElementRef;

  @Input() assessmentResults: AssessmentResult;

  chart: Chart;
  labels: string[];
  data: number[];
  id: string;

  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    this.labels = this.assessmentResults.barChartData.map((dat)=> dat.range);
    this.data = this.assessmentResults.barChartData.map((dat)=> dat.count);

  }

  ngAfterViewInit() {
    this.chart = this._loadChart(this.assessmentResults.barChartData);
    this.cdr.detectChanges();
  }

  private _loadChart(data: BarChartData[]) {
    if (this.chart) {
      this.chart.destroy();
    }
    return new Chart(this.distributionScoreChart.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: `Distribution of scores`,
            data: this.data,
            backgroundColor: '#1F7A8C',
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        normalized: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribution of scores',
            font: {size: 14, weight: 'normal'}
          },
          legend: {
            display: false,
            position: "bottom",
            labels: {
              boxWidth: 12,
              useBorderRadius: true,
              borderRadius: 6
            },
          
          },

        },
        scales: {
          x: { 
            stacked: true, 
            grid: {display: false} ,
            ticks: { 
              maxTicksLimit: 12,
              autoSkip: false
            },
            title: {
              display: true,
              text: 'Score percentage'
            }
          },
          y: { 
            stacked: true, 
            grid: {color: '#F0F0F0'},  
            ticks: { 
              maxTicksLimit: 6, 
              autoSkip: true 
            },
            title: {
              display: true,
              text: 'Number of students'
            }
          },
        },
      },
    });
  }
}
