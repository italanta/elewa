import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SubSink } from 'subsink';

@Component({
  selector: 'app-message-template-create',
  templateUrl: './message-template-create.component.html',
  styleUrls: ['./message-template-create.component.scss'],
})
export class MessageTemplateCreateComponent implements OnInit, OnDestroy {
  private _sBs = new SubSink();
  selectedTab = 1;

  constructor(private router: ActivatedRoute) {}

  ngOnInit() {
    this._sBs.sink = this.router.queryParams.subscribe((params) => {
      this.selectedTab = params['selectedTab'];
    });
  }

  ngOnDestroy(): void {
    this._sBs.unsubscribe();
  }
}
