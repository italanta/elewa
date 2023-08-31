import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { DomainStructure } from '../../model/domain.interface';

@Injectable()
export class ActiveDomainLoader {

  constructor(private _router$$: Router,
              protected _logger: Logger
  ) { }

  public fetchDomainAccess(): Observable<DomainStructure> {
    return this._getDomain();
  }

  private _getDomain(): Observable<DomainStructure> {
    return this._getActiveRoute()
      .pipe(map(r => {
        const els = r.url.split('/');
        return {
          url: els.length >= 0 ? els[0] : false,
          domain: els.length >= 1 ? els[1] : false,
          type: els.length >= 1 ? els[2] : false,
          id: els.length >= 2 ? els[3] : false,
          action: els.length >= 2 ? els[4] : false
        } as DomainStructure;
      }));
  }

  private _getActiveRoute() {
    return this._router$$.events.pipe(filter(ev => ev instanceof NavigationEnd),
      map(ev => ev as NavigationEnd));
  }

  private _isValidDomain(type: string): boolean {
    return ['business', 'operations', 'settings', 'budgets'].indexOf(type) >= 0;
  }

  public isValidFinanceObject(artifect: DomainStructure) {
    return !!artifect.type && artifect.id && artifect.action && artifect.domain && artifect.url
      && this._isValidDomain(artifect.domain as string);
  }
}
