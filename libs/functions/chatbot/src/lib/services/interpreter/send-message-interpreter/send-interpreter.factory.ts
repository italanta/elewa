import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { WhatsappSendMessageInterpreter } from "./whatsapp/whatsapp-api-send-message-interpreter.class";

/** Resolves the receive message interpreter based on the Platform */
export class SendMessageInterpreterFactory {

    resolvePlatform(platform: Platforms){
        switch (platform) {
            case Platforms.WhatsApp:
                return new WhatsappSendMessageInterpreter()
            default:
                break;
        }
    }
}