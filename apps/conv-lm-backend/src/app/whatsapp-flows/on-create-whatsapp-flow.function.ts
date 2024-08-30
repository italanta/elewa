
import { FirestoreCreateRegistrar } from "@ngfi/functions";
import { ConvLearnFunction } from "../../conv-learn-func.class";
import { CreateWhatsappFlowHandler } from '@app/functions/whatsapp-flows';

const createNewWhatsappFlowHandler = new CreateWhatsappFlowHandler()
const FLOWS_REPO = `orgs/{orgId}/stories/{storyId}/flows/{flowId}`;

export const onCreateWhatsappFlow = new ConvLearnFunction('onCreateWhatsappFlow',
                                                  new FirestoreCreateRegistrar(FLOWS_REPO),
                                                  [],
                                                  createNewWhatsappFlowHandler)
                                                  .build()
