import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// TODO@paulkahura: Should not have active org as provider.
import { ActiveOrgStore } from '@app/private/state/organisation/main';

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
