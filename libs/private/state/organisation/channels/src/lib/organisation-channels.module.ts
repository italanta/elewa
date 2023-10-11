import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsStore } from './store/channel.store';
import { ChannelService } from './services/channel.service';
import { ActiveOrgStore } from '@app/state/organisation';

@NgModule({
  imports: [CommonModule],
  providers: [
    ChannelsStore,
    ChannelService,
    ActiveOrgStore
  ]
})
export class OrganisationChannelsModule {}
