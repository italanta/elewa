import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.scss'],
})
export class HorizontalBarComponent implements OnInit{
  @ViewChild('barChartCanvas', { static: true }) private barChartCanvas: ElementRef;

  constructor() {}

  ngOnInit() {
    this.createHorizontalBarChart();
  }

  createHorizontalBarChart() {
    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['True', 'False'],
        datasets: [
          {
            label: '',
            data: [85, 69],
            backgroundColor: '#151D9A',
            borderColor: '#151D9A',
            borderWidth: 1,
            barThickness: 40,
          },
        ],
      },
      options: {
        scales: {
          x: {
            beginAtZero: true,
            
          },
          y: {
            suggestedMax:100,
            beginAtZero: false,
            grid: {
              display: false
            },
          },
        },
        indexAxis: 'y',
      },
    });
  }

}
