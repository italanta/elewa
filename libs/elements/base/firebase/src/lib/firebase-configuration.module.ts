import { ModuleWithProviders, NgModule } from '@angular/core';

import { REGION } from '@angular/fire/compat/functions';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from '@angular/fire/compat/firestore';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';
import { UserTrackingService, ScreenTrackingService } from '@angular/fire/analytics';

@NgModule({
  imports: [],
  exports: []
})
export class FirebaseConfigurationModule
{
  static forRoot(isDev: boolean, useEmulators: boolean): ModuleWithProviders<FirebaseConfigurationModule> {
    return {
      ngModule: FirebaseConfigurationModule,
      providers: [
        { provide: REGION, useValue: 'europe-west1' },
        // https://github.com/angular/angularfire/blob/master/docs/emulators/emulators.md
        { provide: USE_FUNCTIONS_EMULATOR, useValue: (isDev && useEmulators) ? ['localhost', 5001] : undefined },
        { provide: USE_AUTH_EMULATOR, useValue: (isDev && useEmulators) ? ['http://localhost:9099'] : undefined },
        { provide: USE_FIRESTORE_EMULATOR, useValue: (isDev && useEmulators) ? ['localhost', 8080] : undefined },
        UserTrackingService,
        ScreenTrackingService,
      ]
    };
  }
}


