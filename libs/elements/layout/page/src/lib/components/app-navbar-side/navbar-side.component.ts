import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@iote/bricks-angular';
// import { AngularFireAnalytics } from '@angular/fire/analytics';
import { BreadCrumb } from '../sub-bar/breadcrumb.interface';

declare const window: Window;

@Component({
  selector: "app-navbar-side",
  templateUrl: "navbar-side.component.html",
  styleUrls:  ["navbar-side.component.scss"],
})
export class NavbarSideComponent implements OnInit
{
  @Input() breadcrumbs: BreadCrumb[];

  promoteInstall = false;
  installPrompt: any;

  constructor(
    private _logger: Logger
    // private _analytics: AngularFireAnalytics
  ) {}

  ngOnInit()
  {
    this._logger.debug(() => "Navbar initialized.");

    if(window)
      window.addEventListener('beforeinstallprompt', (e) => {
        // Stash the event so it can be triggered later.
        this.installPrompt = e;
        this.promoteInstall = true;
        // this._analytics.logEvent('prompt_user_install');
      });
  }

  install() {
    this.installPrompt.prompt();

    this.installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        this.promoteInstall = false;
        // this._analytics.logEvent('user_installed_app');
      }
      // else
      //   this._analytics.logEvent('user_rejected_install_app');
    });
  }

  getLogo = () => 'assets/images/italanta-logo.png';
}
