import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActiveOrgStore } from '@app/state/organisation';

import { ChannelsStore } from './store/channel.store';
import { ChannelService } from './services/channel.service';

@NgModule({
  imports: [CommonModule],
  providers: [
    ChannelsStore,
    ChannelService,
    ActiveOrgStore
  ]
})
export class OrganisationChannelsModule {}
