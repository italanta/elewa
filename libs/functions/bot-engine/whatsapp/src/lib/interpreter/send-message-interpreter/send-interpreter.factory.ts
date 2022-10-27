import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";
import { WhatsappSendMessageInterpreter } from "./whatsapp/whatsapp-api-send-message-interpreter.class";

/** Resolves the receive message interpreter based on the Platform */
export class SendMessageInterpreterFactory {

    resolvePlatform(platform: PlatformType){
        switch (platform) {
            case PlatformType.WhatsApp:
                return new WhatsappSendMessageInterpreter()
            default:
                break;
        }
    }
}