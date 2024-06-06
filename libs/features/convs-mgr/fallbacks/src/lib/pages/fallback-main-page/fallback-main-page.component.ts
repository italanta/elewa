import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FallbackService } from '@app/state/convs-mgr/fallback';

import { FallbackModalComponent } from '../../modals/fallback-modal/fallback-modal.component';
import { Fallback } from '@app/model/convs-mgr/fallbacks';

@Component({
  selector: 'app-fallback-main-page',
  templateUrl: './fallback-main-page.component.html',
  styleUrls: ['./fallback-main-page.component.scss'],
})
export class FallbackMainPageComponent implements OnInit {
  fallbacks: Fallback[];

  constructor(public dialog: MatDialog, private fallbackService: FallbackService) {}

  ngOnInit(): void {
    this.fallbackService.getAllFallbacks()
                      .subscribe((fallbacks)=> {
                        if(fallbacks) {
                          this.fallbacks = fallbacks;
                        }
                      })
  }

  openModal() {
    this.dialog.open(FallbackModalComponent, {
      panelClass: "fallback-modal-class"
     
    });
  }
}
