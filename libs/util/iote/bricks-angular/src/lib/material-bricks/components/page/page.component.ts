import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';

import { Logger } from '../../../util/services/logger.service';
import { ThemingService } from '../../services/theming.service';


@Component({
  selector:    'iote-page',
  templateUrl: './page.component.html',
  styles: ['.spin-holder { width: 50px; height: 50px;}', '#page-loader { text-align: center; }']
})
export class PageComponent implements OnInit, OnDestroy
{
  private _sbS = new SubSink();

  @Input() loading = false;
  @Input() loadingText = "Loading data.."

  private _slug = new BehaviorSubject<string>("default");

  @Input()  set slug(value) { this._slug.next(value); }
            get slug() {  return this._slug.getValue(); }

  theme: string;

  constructor(private _logger: Logger,
              private _themingService: ThemingService)
  {}

  ngOnInit() {
    this._logger.debug(() => "Page initialised. Loading components.");

    this._sbS.sink = this._slug.subscribe(s => {
      this._themingService.setSubjectTheme(s);
      this.theme = s + '-theme';
      // Slug + theme should be encapsulated in service. Too much work for limited use cases.
    });
  }

  ngOnDestroy() {
    this._themingService.setDefault();
    this._sbS.unsubscribe();
  }
}
