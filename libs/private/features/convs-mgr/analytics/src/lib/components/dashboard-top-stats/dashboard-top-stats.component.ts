import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-top-stats',
  templateUrl: './dashboard-top-stats.component.html',
  styleUrls: ['./dashboard-top-stats.component.scss'],
})
export class DashboardTopStatsComponent {
  @Input() topStats: {count: number, color: string, text: string, icon: string}[];
}
