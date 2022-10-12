import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { HandlerTools } from "@iote/cqrs";
import { SendWhatsAppMessageModel } from "../models/whatsapp/whatsapp-send-message.model";


export class SendMessageFactory {
    constructor(private _platform: Platforms, private _tools: HandlerTools){}

    resolvePlatform(){
        switch (this._platform) {
            case Platforms.WhatsApp:
                return new SendWhatsAppMessageModel(this._tools)
            // case Platforms.Telegram:
                // Return send telegram message model
                // break;            
            default:
                return new SendWhatsAppMessageModel(this._tools)
        }
    }
}