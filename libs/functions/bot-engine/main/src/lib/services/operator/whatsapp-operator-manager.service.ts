import { OperatorService } from "./operator-abstract.service";

import { PlatformType } from "@app/model/convs-mgr/conversations/admin/system";

export class WhatsAppOperatorManager extends OperatorService {
    platform = PlatformType.WhatsApp

    generateLink(phoneNumber: string): string {

        const link = `https://wa.me/${phoneNumber}`

        return link
    }
}