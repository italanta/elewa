import { Observable } from 'rxjs';

import { BotModule } from '@app/model/convs-mgr/bot-modules';
import { Story } from '@app/model/convs-mgr/stories/main';

import { Bot } from './bots.interface';

/**
 * Abstraction around the bot interface as a helper for a V1 editor state
 */
export interface Course
{
  bot: Bot;
  modules$: Observable<{ module: BotModule; stories$: Observable<Story[]>;}[]>;
}

export type BotV1 = Course;
