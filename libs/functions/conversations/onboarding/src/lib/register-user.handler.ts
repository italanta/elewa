import { FunctionContext, FunctionHandler, RestResult200, RestResult } from '@ngfi/functions';
import { HandlerTools } from '@iote/cqrs';

import { Chat, CHAT_ID, ChatStatus} from '@app/model/convs-mgr/conversations/chats';
import { RegisterUserRequest } from './register-user.dto';

export class RegisterUserHandler extends FunctionHandler<RegisterUserRequest, RestResult200>
{
  /**
   * Register User Handler. Records all onboarding information of a user
   *
   * @param req - Onboarding info */
  public async execute(req: RegisterUserRequest, context: FunctionContext, tools: HandlerTools)
  {
    tools.Logger.log(() => `[RegisterUserHandler].execute: Chat with id ${req.id} provided user details and is onboarded. Name: ${req.name} | Phone: ${req.phone}.`);
    tools.Logger.log(() => JSON.stringify(req));

    const userRepo = tools.getRepository<Chat>('sessions');

    const uid = CHAT_ID(req.id);
    const user = await userRepo.getDocumentById(uid);

    if(user)
    {
      user.name = req.name;
      user.phone = this._sanetizePhone(req.phone);
      user.info = {
        age: req.age,
        county: req.county,
        scoutBefore: req.scoutBefore,
      };
      user.status = ChatStatus.Onboarded;

      tools.Logger.log(() => 'Updating user to: ' + JSON.stringify(user));
      await userRepo.write(user, uid);
      return { success: true } as RestResult200;
    }
    else {
      tools.Logger.log(() => '[RegisterUserHandler] WARNING: Onboarding unregistered chat!');
      const user = {
        name: req.name,
        phone: req.phone,
        info: {
          age: req.age,
          county: req.county,
          scoutBefore: req.scoutBefore
        },
        status: ChatStatus.UnknownChannel,
      } as Chat;
      await userRepo.write(user, uid);
      return { success: true } as RestResult200;
    }

  }

  private _sanetizePhone(phone: string)
  {
    if(phone.startsWith('254'))
      phone = phone.substring(3);
    else if(phone.startsWith('+254'))
      phone = phone.substring(4);
    else if(phone.startsWith('7'))
      phone = phone;
    else if(phone.startsWith('07'))
      phone = phone.substring(1);

    return phone;
  }
}
