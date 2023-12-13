import { AfterViewInit, ChangeDetectorRef, Component, Inject, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';
import { Subscription } from 'rxjs';

import { AppClaimDomains } from '@app/private/model/access-control';
import { PermissionsStore } from '@app/private/state/organisation/main';
import { FeatureFlagsService } from '@app/elements/base/feature-flags';

import { MenuStateToggleService } from '../../providers/messages-menu-state';
import { SidemenuToggleService } from '../../providers/sidemenu-toggle.service'


import { Poppers } from '../../model/side-menu-popper.model';
import { slideToggle, slideUp } from '../../providers/side-menu-constants.function';


/**
 * Sidemenu component for the CONVERSATIONAL LEARNING project. 
 * @see convl-page.module to learn more about how we determine usage of this component.
 */
@Component({
  selector: 'convl-sidemenu',
  templateUrl: './convl-sidemenu.component.html',
  styleUrls: [ './convl-sidemenu.component.scss' ]
})
export class ConvlSideMenuComponent implements AfterViewInit, OnDestroy 
{
  private _sbS = new SubSink();
  private _subscription: Subscription;

  @Input() user: any;
  
  FIRST_SUB_MENUS_BTN: NodeListOf<Element>;

  getLogo = 'assets/images/italanta-logo.png';
  projectName: string;
  projectInfo: string;

  isExpanded:boolean;

  readonly CAN_ACCESS_BOTS = AppClaimDomains.BotsView;
  readonly CAN_ACCESS_ANALYTICS = AppClaimDomains.AnalyticsView;
  readonly CAN_ACCESS_CHATS = AppClaimDomains.ChatsView;
  readonly CAN_ACCESS_LEARNERS = AppClaimDomains.LearnersView;
  readonly CAN_ACCESS_ASSESSMENTS = AppClaimDomains.AssessmentsView;
  readonly CAN_ACCESS_SETTINGS = AppClaimDomains.SettingsView;

  isDropdownOpen: boolean;

  constructor(// private _org$$: ActiveOrgStore,
              // private _flow$$: ActiveCommFlowStore,
              private _router$$: Router,
              private sideMenu:SidemenuToggleService,
              private _mMenuState: MenuStateToggleService,
              private _ps: PermissionsStore,
              public featureFlagsService: FeatureFlagsService,
              private cdr: ChangeDetectorRef,
              @Inject('ENVIRONMENT') private _env: any)
  {
    this._sbS.sink = this.sideMenu.menuStatus$.subscribe((isOpen) => (this.isExpanded = isOpen));
    this._sbS.sink = this._mMenuState.menuState$.subscribe((isOpen) => (this.isDropdownOpen = isOpen));
    this._sbS.sink = this.featureFlagsService.init(); 
    
  }

  ngAfterViewInit(): void {
    const featureName = this._router$$.url.split('/')[1];

    this.handlerUserNavClicks();
    this.openActiveFeature(featureName);
  }

  handlerUserNavClicks() {

    const PoppersInstance = new Poppers();
    const SIDEBAR_EL = document.getElementById("sidebar");
    this.FIRST_SUB_MENUS_BTN = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu > a"
    );
    const INNER_SUB_MENUS_BTN = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu .menu-item.sub-menu > a"
    );
    const defaultOpenMenus = document.querySelectorAll(".menu-item.sub-menu.open");

    defaultOpenMenus.forEach((element: any) => {
      element.lastElementChild.style.display = "block";
    });    

    /**
     * handle top level submenu click
     */
    this.FIRST_SUB_MENUS_BTN.forEach((element) => {
      element.addEventListener("click", () => {
        if (SIDEBAR_EL?.classList.contains("collapsed"))
          PoppersInstance.togglePopper(element.nextElementSibling);
        else {
          const parentMenu = element.closest(".menu.open-current-submenu");
          if (parentMenu)
            parentMenu
              .querySelectorAll(":scope > ul > .menu-item.sub-menu > a")
              .forEach(
                (el: any) =>
                  window.getComputedStyle(el.nextElementSibling).display !==
                  "none" && slideUp(el.nextElementSibling)
              );
          slideToggle(element.nextElementSibling);
        }
      });
    });

    /**
     * handle inner submenu click
     */
    INNER_SUB_MENUS_BTN.forEach((element) => {
      element.addEventListener("click", () => {
        slideToggle(element.nextElementSibling);
      });
    });
  }
  
  navigateToBots(){
    this._router$$.navigate(['/bots'])
  }

  navigateToHome(){
    this._router$$.navigate(['/home'])
  }

  navigateToAnalytics() {
    this._router$$.navigate(['/analytics/dashboard']);
  }

  navigateToSurveys(){
    this._router$$.navigate(['/surveys']);
  }

  openActiveFeature(feature: string, ) {
    const features = ['home', 'stories', 'analytics', 'assessments', 'chats'];
    const featureIndex = features.indexOf(feature);
    const featureEl = this.FIRST_SUB_MENUS_BTN[featureIndex];
    slideToggle(featureEl?.nextElementSibling);
  }

  toggleMenu () {
    this.sideMenu.toggleExpand(!this.isExpanded)
  }

  toggleDropdown() {
    this._mMenuState.toggleMenuState(!this.isDropdownOpen);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }

}
