import { EndpointRegistrar } from "@ngfi/functions";

import { CMI5Listener } from "@app/private/functions/micro-apps/cmi5";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new CMI5Listener();

export const cmi5Listener= new ConvLearnFunction('cmi5Listener', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();