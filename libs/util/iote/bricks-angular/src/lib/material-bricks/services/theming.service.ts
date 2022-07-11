import {OverlayContainer} from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

const DEFAULT_THEME = 'default-theme';

/**
 * Theming Service
 * 
 * Enables theming throughout the application. Depends on Angular Material.
 */
@Injectable()
export class ThemingService 
{
  private _topContainerClassList: DOMTokenList;
  
  private _theme = DEFAULT_THEME;

  constructor(overlayContainer: OverlayContainer) { 
    this._topContainerClassList = overlayContainer
                                    .getContainerElement()
                                    .classList;

    this.setDefault();
  }

  public initThemingService() {
    
  }

  public setTheme(themeName: string) 
  {
    this._setTheme(themeName);
  }

  public setSubjectTheme(slug: string) {
    this._setTheme(slug + '-theme');
  }

  public setDefault() {
    this._setTheme(DEFAULT_THEME);
  }

  private _setTheme(newTheme: string) {
    this._topContainerClassList.remove(this._theme);

    this._theme = newTheme;

    this._topContainerClassList.add(this._theme);
  }
}
