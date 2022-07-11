import { Injectable } from '@angular/core';
import { TranslocoLoader, Translation } from '@ngneat/transloco';
import { HttpClient } from '@angular/common/http';

/**
 * Multilang Root Module.
 *
 * Import into App Module for proper Multilang configuration of the whole app.
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader
{
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}
