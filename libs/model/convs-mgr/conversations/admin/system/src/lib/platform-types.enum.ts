/**
 * Different platforms supported by the system.
 * 
 * A platform is third-party API which allows us to receive and send different types of messages 
 *    to an identefiable end user.
 * 
 * A platform usually has a different procedure to connect it, 
 *    the incoming and outgoing data formats are often different AND
 *    the endpoints we use to register channels are specific to the platform.
 * 
 * The @enum {PlatformType} holds an overview of all the platforms we support. 
 */
export enum PlatformType 
{
  /** WhatsApp Business API */
  WhatsApp  =  'whatsapp',
  /** Telegram API */
  Telegram  =  'telegram',
  /** Messenger API */
  Messenger =  'messenger',
}

/**
 * Function which converts a platform type to a prefix stored for the user.
 * 
 * @note The IDs of incoming end-users are prepended following the format:
 *          `{platform}_{n}_{end-user-ID}` with n being the n'th connection that an
 *          organisation is making to the same platform.
 * 
 * @param T: PlatformType 
 * @returns {string} - The prefix for the given platform
 */
export function __PlatformTypeToPrefix (t: PlatformType)
{
  switch(t) {
    case PlatformType.WhatsApp:
      return 'w';
    case PlatformType.Telegram:
      return 't';
    case PlatformType.Messenger:
      return 'm';
    default:
      throw new Error('Platform type is undefined.')
  }
}

/**
 * Function which converts a platform prefix stored on an incoming enduser ID to a platform type.
 * 
 * @note The IDs of incoming end-users are prepended following the format:
 *          `{platform}_{n}_{end-user-ID}` with n being the n'th connection that an
 *          organisation is making to the same platform.
 * 
 * @param {string}: Prefix of a platform type 
 * @returns {PlatformType} - The platform which corresponds to the prefix.
 */
 export function __PrefixToPlatformType (prefix: string)
 {
   switch(prefix) {
     case 'w':
       return PlatformType.WhatsApp;
     case 't':
       return PlatformType.Telegram;
     case 'm':
       return PlatformType.Messenger;
     default:
       throw new Error('Cannot find prefix for platform type.')
   }
 }
