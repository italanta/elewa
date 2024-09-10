import { RestRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";
import { CreateWhatsappFlowHandler } from '@app/functions/whatsapp-flows';

const createNewWhatsappFlowHandler = new CreateWhatsappFlowHandler()

export const createWhatsappFlow = new ConvLearnFunction('createWhatsappFlow',
                                                  new RestRegistrar(),
                                                  [],
                                                  createNewWhatsappFlowHandler)
                                                  .build()
