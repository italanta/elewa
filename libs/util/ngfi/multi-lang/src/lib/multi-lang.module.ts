import { NgModule, ModuleWithProviders, PLATFORM_ID, NgZone } from '@angular/core';

import { TranslateService } from './services/translate.service';
import { LocalPersistanceModule } from '@iote/local-persistance';

import { TRANSLOCO_LOADER, TRANSLOCO_CONFIG, translocoConfig, TranslocoModule } from '@jsverse/transloco';

import { TranslocoHttpLoader } from './config/http-loader.service';
import { CustomLanguageLoader } from './config/multi-lang-loader.service';

/**
 * Translate Module.
 *
 * Contains the translate service and modules to enable translation.
 *
 * @TODO: Ideally would contain a custom translate pipe as well, but transloco does not expose its API adequatly enough to
 *        fully shade its transloco pipe (some needed DI injection tokens are shaded).
 *
 *        For now,use the transloco pipe in HTML templates. */
@NgModule({
  imports: [TranslocoModule, LocalPersistanceModule],
  providers: [],
  // Export so that translate implementation remains isolated
  //   yet translate pipe remains accessible.
  exports: [TranslocoModule]
})


export class MultiLangModule {
  static forRoot(loadHttp: boolean, langs?: string[]): ModuleWithProviders<MultiLangModule> {
    return {
      ngModule: MultiLangModule,
      providers: [
        TranslateService,
        // {
        //   provide: TRANSLOCO_CONFIG,
        //   useValue: translocoConfig({
        //     availableLangs: langs ?? ['en', 'fr', 'nl'],
        //     defaultLang: langs ? langs[0] : 'en',
        //     fallbackLang: langs ? langs[0] : 'en',
        //     reRenderOnLangChange: true,
        //     prodMode: true
        //   })
        // },
        
        // (loadCustomProviders(loadHttp))
      ].filter(a => a != null)
    };
  }
}

//Load providers for custom language loader.
function loadCustomProviders(loadHttp: boolean) {
  if (loadHttp) {
    return { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  } else {
    return [
            { provide: TRANSLOCO_LOADER, useClass: CustomLanguageLoader }
           ];
  }

}
