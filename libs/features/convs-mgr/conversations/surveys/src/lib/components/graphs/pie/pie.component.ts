import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements OnInit {
  @ViewChild('assessmentPieChartCanvas', { static: true }) private assessmentPieChartCanvas: ElementRef;

  constructor() { }

  ngOnInit() {
    this.createAssessmentPieChart();
  }

  createAssessmentPieChart() {
    const ctx = this.assessmentPieChartCanvas.nativeElement.getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Good', 'Very Good', 'Poor', 'Very Poor'],
        datasets: [
          {
            data: [15, 25, 5, 5], // Modify data values as needed
            backgroundColor: [
              'rgba(31, 122, 140, 1)', // Good
              'rgba(21, 29, 154, 1)',  // Very Good
              'rgba(111, 88, 233, 1)', // Poor
              'rgba(148, 209, 61, 1)', // Very Poor
            ],
            
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        radius: 120,
        plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle:true,
            pointStyle: 'circle',
          }
        },
        }
        
      }
    });
  }
}