import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Bot } from '@app/model/convs-mgr/bots';

import { FallBackActionTypes, Fallback } from '@app/model/convs-mgr/fallbacks';
import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FallbackService } from '@app/state/convs-mgr/fallback';

@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit {
  fallbacks: Fallback[];
  @Input() bot: Bot;

  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<Fallback>;

  constructor(public dialog: MatDialog,
              private fallbackService: FallbackService
  ) {}

  ngOnInit(): void {
    this.getFallbacks()
  }

  openModal(i: number) {
    const selectedFallBack = this.fallbacks[i];
    this.dialog.open(FallbackModalComponent, {
      panelClass: "fallback-modal-class",
      data: {fallback: selectedFallBack, bot: this.bot}
    });
  }

  /** Fetching and subscribing to all fall backs data */
  getFallbacks(){
    this.fallbackService.getAllFallbacks().subscribe(_fallbacks => {
      this.fallbacks = _fallbacks
      this.dataSource = new MatTableDataSource<Fallback>(_fallbacks);
    })
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  
}
