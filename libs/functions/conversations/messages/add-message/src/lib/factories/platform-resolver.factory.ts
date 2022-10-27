import { MessagesDataService } from "@app/functions/chatbot";
import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { AddWhatsappMessage } from "../services/add-whatsapp-message.service";

export class AddMessageFactory {

    constructor(private _msgDataService$: MessagesDataService){}

    resolveAddMessagePlatform(platform: PlatformType){

        switch (platform) {
            case PlatformType.WhatsApp:
                return new AddWhatsappMessage(this._msgDataService$)
            default:
                break;
        }
    }

    
}