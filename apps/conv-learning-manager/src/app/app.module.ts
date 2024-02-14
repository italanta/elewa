import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IntercomModule } from 'ng-intercom';

import { MaterialBricksRootModule } from '@iote/bricks-angular';
import { NgFireModule } from '@ngfi/angular';
import { MultiLangModule } from '@ngfi/multi-lang';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { AuthorisationModule } from '@app/elements/base/authorisation';
import { AppConfigurationModule } from '@app/elements/base/configuration';
import { DateConfigurationModule } from '@app/elements/base/date-time';
import { FirebaseConfigurationModule } from '@app/elements/base/firebase';


import { UserStateModule } from '@app/state/user';
import { StoriesStateModule } from '@app/state/convs-mgr/stories';
import { LearnersStateModule } from '@app/state/convs-mgr/learners';
import { EndUsersStateModule } from '@app/state/convs-mgr/end-users';
import { ClassroomStateModule } from '@app/state/convs-mgr/classrooms';
import { StoryBlocksStateModule } from '@app/state/convs-mgr/stories/blocks';
import { StoryBlockConnectionsStateModule } from '@app/state/convs-mgr/stories/block-connections';
import { VariablesConfigStateModule } from '@app/state/convs-mgr/stories/variables-config';
import { ProgressMonitoringStateModule } from '@app/state/convs-mgr/monitoring';
import { MtOrgStateModule } from '@app/private/state/organisation/main';
import { BotsStateModule } from '@app/state/convs-mgr/bots';
import { BotModulesStateModule } from '@app/state/convs-mgr/modules';
import { AccessControlStateModule } from '@app/private/state/access-control';
import { StateAssessmentsModule } from '@app/state/convs-mgr/conversations/assessments';
import { ChannelsStateModule } from '@app/state/convs-mgr/channels';
import { StateSurveysModule } from '@app/state/convs-mgr/conversations/surveys';
import { VariablesModule } from '@app/state/convs-mgr/variables';
import { MessageTemplatesModule } from '@app/private/state/message-templates';


import  { EnvironmentConfigModule } from '@app/admin/config/environment-config'

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

import { environment } from '../environments/environment';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    GooglePlaceModule,
    
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, AngularFirestoreModule, AngularFireFunctionsModule, NgFireModule,
    AngularFireAnalyticsModule,
    HttpClientModule,


    MaterialBricksRootModule.forRoot(),

    UserStateModule.forRoot(),
    AuthorisationModule.forRoot(environment, environment.production),
    EnvironmentConfigModule.forRoot(environment),

    AppConfigurationModule.forRoot(environment, environment.production),
    DateConfigurationModule.forRoot(),
    FirebaseConfigurationModule.forRoot(!environment.production, environment.useEmulators),
    MultiLangModule.forRoot(true),
    // UserNavModule,

    MatProgressBarModule,

    // AppConfigModule.forRoot(),

    // DataModule.forRoot(),
    StoriesStateModule.forRoot(),
    ClassroomStateModule.forRoot(),
    StoryBlocksStateModule.forRoot(),
    StoryBlockConnectionsStateModule.forRoot(),
    VariablesConfigStateModule.forRoot(),
    ProgressMonitoringStateModule.forRoot(),
    EndUsersStateModule.forRoot(),
    LearnersStateModule.forRoot(),
    BotsStateModule.forRoot(),
    BotModulesStateModule.forRoot(),
    StateAssessmentsModule.forRoot(),
    ChannelsStateModule.forRoot(),
    StateSurveysModule.forRoot(),
    MessageTemplatesModule.forRoot(),
    VariablesModule.forRoot(),

    MtOrgStateModule.forRoot(),

    AccessControlStateModule.forRoot(),

    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    IntercomModule.forRoot({
      appId: 'jvwszj2k', 
      updateOnRouterChange: true // will automatically run `update` on router event changes. Default: `false`
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
