import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bot } from '@app/model/convs-mgr/bots';

import { FallBackActionTypes, Fallback } from '@app/model/convs-mgr/fallbacks';
import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {
  @Input() fallbacks: Fallback[];
  @Input() bot: Bot;

  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<Fallback>;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Fallback>(this.fallbacks);
  }

  openModal(i: number) {
    const selectedFallBack = this.fallbacks[i];
    this.dialog.open(FallbackModalComponent, {
      panelClass: "fallback-modal-class",
      data: {fallback: selectedFallBack, bot: this.bot}
    });
  }
}
