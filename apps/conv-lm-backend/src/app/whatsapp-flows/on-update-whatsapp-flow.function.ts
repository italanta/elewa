import { FirestoreUpdateRegistrar } from '@ngfi/functions';
import { ConvLearnFunction } from "../../conv-learn-func.class";
import { UpdateWhatsappFlowHandler } from '@app/functions/whatsapp-flows';

const onUpdateWhatsappFlowHandler = new UpdateWhatsappFlowHandler();
const FLOWS_REPO = `orgs/{orgId}/stories/{storyId}/flows/{flowId}`;

export const onUpdateWhatsappFlow = new ConvLearnFunction('onUpdateWhatsappFlow',
                                                  new FirestoreUpdateRegistrar(FLOWS_REPO),
                                                  [],
                                                  onUpdateWhatsappFlowHandler)
                                                  .build()
