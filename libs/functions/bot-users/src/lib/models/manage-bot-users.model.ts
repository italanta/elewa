import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { WhatsAppBotUser } from "@app/model/user/bot-users";
import { HandlerTools } from "@iote/cqrs";

export class ManageBotUsersModel 
{
  _tools: HandlerTools;

  constructor(tools: HandlerTools){
    this._tools = tools;
  }

  /**
   * 
   * @param phoneNumber used by user to chat with bot
   * @param channel channel used e.g telegram, whatsapp
   * @returns Promise of Bot user created
   */
  addUser(phoneNumber:string, channel:PlatformType )
  {
    switch (channel) {
      case PlatformType.WhatsApp:
        return this._addUserToWhatsAppChannel(phoneNumber);
      default:
        break;
    }
  }

  /**
   * 
   * @description Creates a new user for whatsappchannel
   */
  private async _addUserToWhatsAppChannel(phoneNumber:string)
  {
    const _whatsAppUserRepo = this._tools.getRepository<WhatsAppBotUser>(`bot-users/${phoneNumber}/channels/whatsapp`);
    const newBotUser: WhatsAppBotUser = {
      phoneNumber:phoneNumber
    }
    this._tools.Logger.log(() => `[AddNewUserModel] Adding whatsappbot user: ${newBotUser.phoneNumber} 👥`);

    //id of bot user is to be his/her phone number to maintain uniqueness when linking to one bot/story
    return await _whatsAppUserRepo.write(newBotUser, phoneNumber);
  }
}