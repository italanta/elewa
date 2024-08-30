import { FirestoreUpdateRegistrar } from '@ngfi/functions';

import { UpdateWhatsappFlowHandler } from '@app/functions/user';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const onUpdateWhatsappFlowHandler = new UpdateWhatsappFlowHandler();
const FLOWS_REPO = `orgs/{orgId}/stories/{storyId}/flows/{flowId}`;

export const onUpdateWhatsappFlow = new ConvLearnFunction('onUpdateWhatsappFlow',
                                                  new FirestoreUpdateRegistrar(FLOWS_REPO),
                                                  [],
                                                  onUpdateWhatsappFlowHandler)
                                                  .build()
