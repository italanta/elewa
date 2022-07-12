import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { TranslocoLoader, Translation } from '@ngneat/transloco';

import { Observable } from 'rxjs';

@Injectable()
export class CustomLanguageLoader implements TranslocoLoader
{
  constructor(private _afs: AngularFirestore)
  { }

  getTranslation(lang: string): Observable<Translation>
  {
    // return this._environment.production ? this._http.get(`./assets/i18n/${lang}.json`)
    //                                     : this._afs.doc<any>(`langs/${lang}`).valueChanges();
    return this._afs.doc<any>(`langs/${lang}`).valueChanges();
  }
}

// export const customLoader = {
//   provide: TRANSLOCO_LOADER,
//   useClass: CustomLanguageLoader
// }
