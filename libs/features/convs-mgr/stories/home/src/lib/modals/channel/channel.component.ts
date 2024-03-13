import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable, switchMap } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';
import { CommunicationChannel, PlatformType } from '@app/model/convs-mgr/conversations/admin/system';
import { BotsStateService } from '@app/state/convs-mgr/bots';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

@Component({
  selector: 'italanta-apps-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnChanges
{
  private _selectedPlatformAndBot: { selectedPlatform: PlatformType, botId: string; };

  @Input() set selectedPlatformAndBot(value: { selectedPlatform: PlatformType, botId: string; })
  {
    this._selectedPlatformAndBot = value;
    if (this._selectedPlatformAndBot && this._selectedPlatformAndBot.selectedPlatform !== undefined) {
      this.fetchChannels();
    }
  }
  // selectedPlatform:PlatformType;
  channels: CommunicationChannel[];
  selectedChannelId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { selectedPlatform: PlatformType, botId: string; },
    private channelService: CommunicationChannelService,
    private _botsService: BotsStateService,
    private dialogRef: MatDialogRef<ChannelComponent>,
    private _dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges)
  {
    if (changes['selectedPlatformAndBot'] && changes['selectedPlatformAndBot'].currentValue) {
      this.fetchChannels();
    }
  }

  fetchChannels()
  {
    // Check if selectedPlatformAndBot and selectedPlatform are defined
    if (this._selectedPlatformAndBot && this._selectedPlatformAndBot.selectedPlatform) {
      this.channelService.getChannelsByType(this._selectedPlatformAndBot.selectedPlatform).subscribe((channels) =>
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

    const botId = this.data.botId;

    // Add the botId to the selected channel
    selectedChannel.linkedBot = botId;

    // Update the channel
    this.channelService.updateChannel(selectedChannel).subscribe(() =>
    {
      this._dialog.closeAll(); // Close the dialog after updating the channel
    });

    // Update the bot
    (this._botsService.getBotById(botId) as Observable<Bot>).pipe(switchMap((bot) =>
    {
      bot.linkedChannel = selectedChannel.id;

      return this._botsService.updateBot(bot);
    })).subscribe();
  }

  returnToPlatform()
  {
    this.dialogRef.close();
  }

}
