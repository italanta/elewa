import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import { DataPerChatQuery } from './queries/data-per-chat.query';
import { DataPerDayQuery } from './queries/data-per-day.query';

@NgModule({
  imports: [CommonModule,
            RouterModule],
  providers: []
})
export class ConversationStateDataModule
{
  static forRoot(): ModuleWithProviders<ConversationStateDataModule>
  {
    return {
      ngModule: ConversationStateDataModule,
      providers: [DataPerDayQuery] // DataPerChatQuery
    };
  }
}
