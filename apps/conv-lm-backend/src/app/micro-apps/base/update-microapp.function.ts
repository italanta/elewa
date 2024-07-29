import { RestRegistrar } from "@ngfi/functions";

import { UpdateMicroAppHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new UpdateMicroAppHandler();

export const updateMicroApp = new ConvLearnFunction('updateMicroApp', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
                               