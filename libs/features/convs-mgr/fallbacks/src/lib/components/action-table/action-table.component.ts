import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { Bot } from '@app/model/convs-mgr/bots';

import { SubSink } from 'subsink';

import { Fallback } from '@app/model/convs-mgr/fallbacks';
import { FallbackService } from '@app/state/convs-mgr/fallback';

import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';


@Component({
  selector: 'app-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.scss'],
})
export class ActionTableComponent implements OnInit, OnDestroy {
  fallbacks: Fallback[];
  @Input() bot: Bot;
  /** Whether a fallback is active */
  isActive: boolean

  displayedColumns = ['userSays', 'action', 'actionDetails', 'actionButtons']
  dataSource: MatTableDataSource<Fallback>;

  private _sBS = new SubSink()

  constructor(public dialog: MatDialog,
              private fallbackService: FallbackService,
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

  setFallbackOn(fallback: Fallback){
    fallback.active = !fallback.active;
    this.fallbackService.updateFallback({ ...fallback, active: fallback.active })
      .subscribe();
  }

  onDelete(fallback: Fallback){
    this.fallbackService.deleteFallback(fallback).subscribe(()=> {
      this.dataSource.data.filter((_fallback) => _fallback.id !== fallback.id)
    })
  }

  ngOnDestroy(): void {
      this._sBS.unsubscribe()
  }
}
