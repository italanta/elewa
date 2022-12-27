import { NgModule } from '@angular/core';

// import { StorageServiceModule } from 'ngx-webstorage-service';

import { LocalPersistanceService } from './local-persistance.service';

/**
 * Local Persistance Module. Links to DynamoDB.
 *
 * Important - Initialise on App Load in App Module.
 *             providers: [{ provide: APP_INITIALIZER,
 *                           useFactory: (persistenceService: PersistenceService) => () => persistenceService.connect(),
 *                           deps: [PersistenceService],
 *                           multi: true }], */

@NgModule({
  imports: [], //StorageServiceModule],

  providers: [LocalPersistanceService],
})
export class LocalPersistanceModule { }
