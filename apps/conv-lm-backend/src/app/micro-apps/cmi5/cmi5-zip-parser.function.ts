import { RestRegistrar } from "@ngfi/functions";

import { CMI5ZipParser } from "@app/private/functions/micro-apps/cmi5";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new CMI5ZipParser();

export const cmi5ZipParser = new ConvLearnFunction('cmi5ZipParser', 
                                                  new RestRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();