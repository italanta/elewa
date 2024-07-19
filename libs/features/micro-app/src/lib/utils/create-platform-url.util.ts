import { CommunicationChannel, PlatformType, WhatsAppCommunicationChannel } from "@app/model/convs-mgr/conversations/admin/system";

export function getPlatformURL(channel: CommunicationChannel) {
  switch (channel.type) {
    case PlatformType.WhatsApp:
      return _getWhatsappURL(channel);
    default:
      return _getWhatsappURL(channel);
  }
}

function _getWhatsappURL(whatsapp: WhatsAppCommunicationChannel) {
    return `https://wa.me/${whatsapp.phoneNumber}`
}