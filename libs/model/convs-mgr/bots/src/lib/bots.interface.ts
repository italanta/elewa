/**
 * The variable request and response by the user accepts the followind data types
 */
import { IObject } from '@iote/bricks';

/**
 * Interface representing a bot.
 */
export interface Bot extends IObject 
{
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

  /** Type of the element */
  type: BotVersions;

  isPublished?: boolean;

  publishedOn?: Date;

  /* bot archive status*/
  isArchived?: boolean;

  /** The id channel this bot is connected to */
  linkedChannel?: string;

  /** Whether AI fallback is enabled for this bot or not */
  aiFallBackRouting?: boolean;
}

/** botmutation enum - has the different bot mutations you can perfom on a bot */
export enum BotMutationEnum {
  EditMode = 'Edit Bot',
  CreateMode = 'Create Bot',
}

/** 
 * The type field on the bot is used to determine bot version 
 * 
 *  The bot version determines the editor experience
*/
export enum BotVersions 
{
  /** V1 bots are organized in modules */
  V1Modular='Bot',
  /** V2 bots work with child-stories */
  V2Iterator='V2'
}
