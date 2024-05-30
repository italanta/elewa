import * as moment from "moment";

import { IncomingWhatsAppMessage } from "@app/model/convs-mgr/functions";

export function IsPayloadExpired(whatsappMessage: IncomingWhatsAppMessage) {

  const messageTimestamp = whatsappMessage.entry[0].changes[0].value.messages[0].timestamp;
  const messageTime = moment.unix(parseInt(messageTimestamp));
  const currentTime = moment();
  
  return currentTime.diff(messageTime, 'minutes') > 3;
}