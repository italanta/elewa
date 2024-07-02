import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialBricksRootModule } from '@iote/bricks-angular';
import { NgFireModule } from '@ngfi/angular';
import { MultiLangModule, TranslocoHttpLoader } from '@ngfi/multi-lang';

import { MicroAppStateModule } from '@app/state/convs-mgr/micro-app';

import { AuthorisationModule } from '@app/elements/base/authorisation';
import { ClmMicroAppLayoutModule } from '@app/elements/layout/clm-micro-app';

import { AppConfigurationModule } from '@app/elements/base/configuration';
import { DateConfigurationModule } from '@app/elements/base/date-time';
import { FirebaseConfigurationModule } from '@app/elements/base/firebase';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EnvironmentConfigModule } from '@app/admin/config/environment-config';
import { AppRoutingModule } from './app.routing.module';

import { environment } from '../environments/environment';
import { provideTransloco } from '@jsverse/transloco';
import { ActiveAssessmentStore, AssessmentQuestionStore, AssessmentsStore } from '@app/state/convs-mgr/conversations/assessments';
import { ActiveOrgStore, OrgStore } from '@app/private/state/organisation/main';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, AngularFirestoreModule, AngularFireFunctionsModule, NgFireModule,
    AngularFireAnalyticsModule,

    MaterialBricksRootModule.forRoot(),

    AuthorisationModule.forRoot(environment, environment.production),
    EnvironmentConfigModule.forRoot(environment),

    AppConfigurationModule.forRoot(environment, environment.production),
    DateConfigurationModule.forRoot(),
    FirebaseConfigurationModule.forRoot(!environment.production, environment.useEmulators),
    MultiLangModule.forRoot(true),
    // UserNavModule,

    AppRoutingModule,
    RouterModule,
    ClmMicroAppLayoutModule,
    MaterialBricksRootModule.forRoot(),

    MicroAppStateModule.forRoot()
  ],
  providers:  
  [provideHttpClient(withInterceptorsFromDi()),
   provideTransloco({
       config: {
           availableLangs: ['en', 'fr', 'nl'],
           fallbackLang: 'en',
           prodMode: environment.production
       },
       loader: TranslocoHttpLoader
   }),
   AssessmentsStore,
   ActiveOrgStore,
   OrgStore,
   ActiveAssessmentStore,
   AssessmentQuestionStore,
  ] ,
  bootstrap: [AppComponent],
})
export class AppModule {}
