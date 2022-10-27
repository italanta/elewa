import { HandlerTools } from "@iote/cqrs";

import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { SendWhatsAppMessageModel } from "../models/whatsapp/whatsapp-send-message.model";


/** Factory to resolve the platform to send the message to 
 *  Uses the platform saved on the Message 
*/
export class SendMessageFactory {
    constructor(private _platform: PlatformType, private _tools: HandlerTools){}

    resolvePlatform(){
        switch (this._platform) {
            case PlatformType.WhatsApp:
                return new SendWhatsAppMessageModel(this._tools)
            // case PlatformType.Telegram:
                // Return send telegram message model
                // break;            
            default:
                return new SendWhatsAppMessageModel(this._tools)
        }
    }
}