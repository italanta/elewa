import { IObject } from '@iote/bricks';

import { MessageTemplateConfig } from '@app/model/convs-mgr/conversations/messages';

import { PlatformType } from './platform-types.enum';

/**
 * A @type {CommunicationChannel} is the channel through which the end user communicates with the bot.
 * 
 *    - A @see {CommunicationChannel} represents a connection from our platform (@see {IncomingMessageHandler}) to a third-party platform @see {Platform}.
 *    - A @see {CommunicationChannel} needs to establish a connection with the platform, and can be disconnected.
 *    - Each @see {CommunicationChannel} has a billable account.
 * 
 * @note This CommunicationChannel interface might be subtyped by the different platforms,
 *          in case they require additional parameters for their configuration.
 */
export interface CommunicationChannel extends IObject
{
  /** Id of the channel. Often, this reuses the unique ID also set by the third-party provider for this channel. */
  id?: string;
  /** User-defined name for the channel. Defaults to @type {PlatformType}. */
  name: string;

  /** FK to the organisation to which this channel is connected. */
  orgId: string;
  /** In case this is set, defines the default behaviour of the channel,
   *    in case of new incoming chats. */
  defaultStory?: string;

  /**
   * Message template configuration for platforms that requires users to 
   *  send a message to the bot before it can send a message to the user
   *  e.g. whatsapp
   */
  templateConfig?: MessageTemplateConfig;  

  /** Platform type of the channel */
  type: PlatformType;

  /** Technical ref.
   *  @note The IDs of incoming end-users are prepended following the format:
   *          `{platform}_{n}_{end-user-ID}` with n being the n'th connection that an
   *          organisation is making to the same platform. */
  n: number;

   /**
   * Each Channel can be assigned only a single bot 
   */
   linkedBot?:string
}
