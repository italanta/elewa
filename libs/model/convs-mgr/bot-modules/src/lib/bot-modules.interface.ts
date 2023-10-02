/**
 * The variable request and response by the user accepts the followind data types
 */
import { IObject } from '@iote/bricks';

/**
 * Interface representing a bot's module.
 */
export interface BotModules extends IObject {
  /** The name of the module.*/
  name: string;

  /** A brief description of the module. */
  description?: string;

  /** An array of story id's associated with the bot.*/
  stories: string[];
}
