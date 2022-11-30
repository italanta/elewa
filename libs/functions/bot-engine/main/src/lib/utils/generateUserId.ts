import { PlatformType, __PlatformTypeToPrefix } from "@app/model/convs-mgr/conversations/admin/system";
import { Message } from "@app/model/convs-mgr/conversations/messages";

  /** Generate the end user id in the format `{platform}_{n}_{end-user-ID}`
  * 
  * 
  * @note The IDs of incoming end-users are prepended following the format:
  *          `{platform}_{n}_{end-user-ID}` with n being the n'th connection that an
  *          organisation is making to the same platform.
  */
   export function generateEndUserId(message: Message, platformType: PlatformType, n: number): string 
   {
     return __PlatformTypeToPrefix(platformType) + '_' + n.toString() + '_' + message.endUserPhoneNumber;
   }