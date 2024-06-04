import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { Fallback } from '@app/model/convs-mgr/fallbacks';
import { FallbackService } from '@app/state/convs-mgr/fallback';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {

  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<Fallback>;

  constructor(private _fallBackService: FallbackService) {}

  ngOnInit(): void {
    this._fallBackService.getAllFallbacks().subscribe((data: Fallback[]) => {
      this.dataSource = new MatTableDataSource<Fallback>(data);
    });
  }
}
