import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";
import { WhatsappReceiveMessageInterpreter } from "./whatsapp-api-message-to-base-message.class";

/** Resolves the receive message interpreter based on the Platform */
export class ReceiveInterpreterFactory {

    resolvePlatform(platform: Platforms){
        switch (platform) {
            case Platforms.WhatsApp:
                return new WhatsappReceiveMessageInterpreter()
            default:
                break;
        }
    }
}