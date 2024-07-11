import { EndpointRegistrar } from "@ngfi/functions";

import { UpdateMicroAppProgressHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new UpdateMicroAppProgressHandler;

export const microAppProgress = new ConvLearnFunction('microAppProgress', 
                                                  new EndpointRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
                                                              