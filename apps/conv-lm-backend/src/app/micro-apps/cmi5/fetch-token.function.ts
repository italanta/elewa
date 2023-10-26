import { EndpointRegistrar } from "@ngfi/functions";

import { FetchAuthToken } from "@app/private/functions/micro-apps/cmi5";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new FetchAuthToken();

export const cmi5FetchToken = new ConvLearnFunction('cmi5FetchToken', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();