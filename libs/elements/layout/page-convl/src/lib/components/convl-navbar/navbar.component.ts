import { Component, OnInit, Input, ChangeDetectorRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TransclusionHelper, Logger } from '@iote/bricks-angular';

@Component({
  selector: "convl-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls:  ["./navbar.component.scss"],
})
export class ConvlNavbarComponent implements OnInit, AfterViewInit 
{
  @Input() title: string;
  @Input() backButton = true;

  @Input() logo: string;

  @Output() toggleMenu: EventEmitter<any> = new EventEmitter();
  @Input() isMenuOpen: boolean;

  constructor(
    private _logger: Logger,
    private _transclusionHelper: TransclusionHelper,
    private _cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._logger.debug(() => "Navbar initialized.");
  }

  ngAfterViewInit() {
    // Solve problem with titleIsEmpty, by forcing change detection.
    // https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error-e3fd9ce7dbb4

    this._cd.detectChanges();
  }

  titleIsEmpty(el: HTMLElement) {
    return this._transclusionHelper.trcElIsEmpty(el);
  }

  goBack() {
    history.back();
  }

  getLogo = () => 'assets/images/italanta-logo.png'

}
