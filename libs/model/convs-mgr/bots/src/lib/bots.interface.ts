/**
 * The variable request and response by the user accepts the followind data types
 */
import { IObject } from '@iote/bricks';

/**
 * Interface representing a bot.
 */
export interface Bot extends IObject {
  /** The name of the bot.*/
  name: string;

  /** A brief description of the bot. */
  description?: string;

  /** An array of module names associated with the bot.*/
  modules: string[];
}
