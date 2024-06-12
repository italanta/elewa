import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { combineLatest } from 'rxjs';

import { FallbackService } from '@app/state/convs-mgr/fallback';

import { Fallback } from '@app/model/convs-mgr/fallbacks';
import { Bot } from '@app/model/convs-mgr/bots';

import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';

@Component({
  selector: 'app-fallback-main-page',
  templateUrl: './fallback-main-page.component.html',
  styleUrls: ['./fallback-main-page.component.scss'],
})
export class FallbackMainPageComponent implements OnInit {
  fallbacks: Fallback[];
  bot: Bot;

  constructor(public dialog: MatDialog, private fallbackService: FallbackService) {}

  ngOnInit(): void {
    const fallbacks$ =this.fallbackService.getAllFallbacks();

    const bot$ = this.fallbackService.getSelectedBot();

    combineLatest([fallbacks$, bot$]).subscribe(([fallbacks, bot])=> {
      this.fallbacks = fallbacks
      if(bot) {
        this.bot = bot
      }
    })
  }

  openModal() {
    this.dialog.open(FallbackModalComponent, {
      panelClass: "fallback-modal-class",
      data: {bot: this.bot}
    });
  }
}
