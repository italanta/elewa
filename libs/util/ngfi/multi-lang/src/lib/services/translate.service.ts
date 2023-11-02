import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { TranslocoService, HashMap } from '@ngneat/transloco';
// import { Intercom } from 'ng-intercom';

import { LocalPersistanceService } from '@iote/local-persistance';

/**
 * Service in charge for translating of strings.
 *
 * Can be used inside other services/components and is the guiding logic of the translate pipe.
 */
@Injectable()
export class TranslateService
{
  protected _lang: 'fr' | 'en' | 'nl';
  protected _lang$: BehaviorSubject<'fr' | 'en'| 'nl'>;

  protected _isOverride = false;

  /** Use transloco as translator */
  constructor(private _transloco: TranslocoService,
              private _localPersistanceSrv: LocalPersistanceService)
              // private _intercom: Intercom)
  {
    if(!this._lang)
    {
      this._lang = this._localPersistanceSrv.getConfig('lang');

      // Lang has never been set
      if(!this._lang)
        this._lang = this._getLangFromUser();
    }

    if(!this._isOverride)
      this.setLang(this._lang);
  }

  initialise()
  {
    if(!this._lang)
    {
      this._lang = this._localPersistanceSrv.getConfig('lang');

      // Lang has never been set
      if(!this._lang)
        this._lang = this._getLangFromUser();
    }

    this.setLang(this._lang);
    return this._lang;
  }

  /** Load the given language, and add it to the service.
  *  Fixes bug that translations are not found when using translateTo but lang is not loaded.
  *
  * @see https://ngneat.github.io/transloco/docs/language-api#load
  */
  loadLang(lang: 'en' | 'nl' | 'fr') : Observable<'en' | 'nl' | 'fr'>
  {
    return this._transloco.load(lang)
                    .pipe(map(() => lang),
                          take(1));
  }

  setLang(lang: 'en' | 'fr' | 'nl')
  {
    this._lang = lang;
    this._localPersistanceSrv.setConfig('lang', lang);
    this._transloco.setActiveLang(lang);

    if (this._lang$ === undefined) {
      this._lang$ = new BehaviorSubject(lang);
    } else {
      this._lang$.next(lang);
    }

    // Update language on intercom
    // this._intercom.update({ language_override: lang });

    return lang;
  }

  getLang() {
    return this._lang;
  }

  getLang$() : Observable<'en' | 'nl' | 'fr'> {
    return this._lang$;
  }

  translate(code: string, params?: HashMap<any>)
  {
    return params ? this._transloco.translate(code, params)
                  : this._transloco.translate(code)
  }

  /**
   * Allows you to translate text to different languages regardless of the current language of the user
   * this is useful when sending communications to multiple people who might speak different languages
   * @param code
   * @param lang
   */
  translateTo(code: string, lang: 'fr' | 'en'| 'nl') {
    return this._transloco.translate(code, {}, lang);
  }

  private _getLangFromUser()
  {
    const defLang = (window && window.navigator && window.navigator.language)
                      || (navigator && navigator.language);

    if(defLang)
    {
                   // e.g. change en-US, en-GB to en, fr-FR to fr, ...
      const lang = defLang.split('-')[0].toLowerCase();

      if(lang === 'en' || lang === 'fr' || lang === 'nl')
        return this.setLang(lang);
    }

    // Return default
    return 'en';
  }
}
