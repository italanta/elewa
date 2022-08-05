import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialBricksModule } from '@iote/bricks-angular';
import { NgFireModule } from '@ngfi/angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { AuthorisationModule } from '@app/elements/base/authorisation';
import { AppConfigurationModule } from '@app/elements/base/configuration';
import { DateConfigurationModule } from '@app/elements/base/date-time';
import { FirebaseConfigurationModule } from '@app/elements/base/firebase';

import { UserStateModule } from '@app/state/user';
import { OrgStateModule } from '@app/state/organisation';
import { StoriesStateModule } from '@app/state/convs-mgr/stories';
import { StoryBlocksStateModule } from '@app/state/convs-mgr/stories/blocks';

import { environment } from '../environments/evironment';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, AngularFirestoreModule, AngularFireFunctionsModule, NgFireModule,
    AngularFireAnalyticsModule,

    MaterialBricksModule.forRoot(),

    UserStateModule.forRoot(),
    AuthorisationModule.forRoot(environment, environment.production),

    AppConfigurationModule.forRoot(environment, environment.production),
    DateConfigurationModule.forRoot(),
    FirebaseConfigurationModule.forRoot(!environment.production, environment.useEmulators),
    MultiLangModule.forRoot(false),
    // UserNavModule,

    MatProgressBarModule,

    // AppConfigModule.forRoot(),

    // DataModule.forRoot(),
    OrgStateModule.forRoot(),
    StoriesStateModule.forRoot(),
    StoryBlocksStateModule.forRoot(),
    // FlowsStateModule.forRoot(),
    // ChatsStateModule.forRoot(),
    // MessagingStateModule.forRoot(),
    // CommChannelsStateModule.forRoot(),

    AppRoutingModule
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
