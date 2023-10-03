/**
 * The variable request and response by the user accepts the followind data types
 */
import { IObject } from '@iote/bricks';

/**
 * Interface representing a bot.
 */
export interface Bot extends IObject {
  /* Foreign Key to Organisation holding the story. */
  orgId: string;

  /** The name of the bot.*/
  name: string;

  /** A brief description of the bot. */
  description?: string;

  /** The bot's image */
  imageField?: string;

  /** An array of module names associated with the bot.*/
  modules: string[];
}

/** botmutation enum - has the different bot mutations you can perfom on a bot */
export enum BotMutationEnum {
  EditMode = 'Edit Bot',
  CreateMode = 'Create Bot',
}
