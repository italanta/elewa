import { SendMessageHandler } from "@app/functions/messages/whatsapp";
import { RestRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new SendMessageHandler();

export const sendMessage = new ConvLearnFunction('sendWhatsappMessage',
                                                  new RestRegistrar(),
                                                  [],
                                                  handler).build();