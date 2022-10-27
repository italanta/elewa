import { OperatorService } from "./operator-abstract.service";

import { Platforms } from "@app/model/convs-mgr/conversations/admin/system";

export class WhatsAppOperatorManager extends OperatorService {
    platform = Platforms.WhatsApp

    generateLink(phoneNumber: string): string {

        const link = `https://wa.me/${phoneNumber}`

        return link
    }
}