import { RestRegistrar } from '@ngfi/functions';

import { CreateNewUserHandler } from '@app/functions/user';

import { ConvLearnFunction } from "../../conv-learn-func.class";

const createNewWhatsappFlowHandler = new CreateWhatsappFlowHandler()
const FLOWS_REPO = `orgs/{orgId}/stories/{storyId}/flows/{flowId}`;

export const onCreateWhatsappFlow = new ConvLearnFunction('onCreateWhatsappFlow',
                                                  new FirestoreCreateRegistrar(),
                                                  [],
                                                  createNewWhatsappFlowHandler)
                                                  .build()
