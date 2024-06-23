import { Component, Input } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { switchMap } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

@Component({
  selector: 'italanta-apps-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent {
  selectedPlatform: PlatformType;
  bot: Bot;
  channels: CommunicationChannel[];
  selectedChannelId: string;

  @Input() set connectChannelData(data: { selectedPlatform: PlatformType, bot: Bot; })
  {
    if (data && data.selectedPlatform) {
      this.selectedPlatform = data.selectedPlatform;
      this.bot = data.bot;

      this.fetchChannels();
    }
  }

  constructor(
    private channelService: CommunicationChannelService,
    private _botsService: BotsStateService,
    private dialogRef: MatDialogRef<ChannelComponent>,
  ) { }

  fetchChannels()
  {
    if(this.selectedPlatform) {
      this.channelService.getChannelsByType(this.selectedPlatform).subscribe((channels) =>
      {
        this.channels = channels;
      });
    }
  }

  onChannelChange(channelId: any)
  {
    this.selectedChannelId = channelId;
  }

  addBotToChannel()
  {
    if (!this.channels || this.channels.length === 0 || !this.selectedChannelId) {
      return;
    }

    // Find the selected channel
    const selectedChannel = this.channels.find((channel) => channel.id === this.selectedChannelId);

    if (!selectedChannel) {
      return;
    }
    // Add the botId to the selected channel
    selectedChannel.linkedBot = this.bot.id;

    // Update the channel
    const updateChannel$ = this.channelService.updateChannel(selectedChannel);

    this.bot.linkedChannel = selectedChannel.id;
    const updateBot$  = this._botsService.updateBot(this.bot);

    updateChannel$.pipe(switchMap(()=> updateBot$)).subscribe(()=> this.dialogRef.close());
  }

  close()
  {
    this.dialogRef.close();
  }

}
