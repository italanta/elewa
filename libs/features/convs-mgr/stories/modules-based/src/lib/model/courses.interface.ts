import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';
import { Bot } from '@app/model/convs-mgr/bots';

// TODO: @LemmyMwaura abstract this type 

export type Course = {
  bot: Bot;
  modules$: Observable<
    {
      module: BotModule;
      stories$: Observable<Story[]>;
    }[]
  >;
}[];
