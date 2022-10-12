import { MessagesDataService } from "@app/functions/chatbot";
import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { AddWhatsappMessage } from "../services/add-whatsapp-message.service";

export class AddMessageFactory {

    constructor(private _msgDataService$: MessagesDataService){}

    resolveAddMessagePlatform(platform: Platforms){

        switch (platform) {
            case Platforms.WhatsApp:
                return new AddWhatsappMessage(this._msgDataService$)
            default:
                break;
        }
    }

    
}