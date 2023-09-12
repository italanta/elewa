import { EndpointRegistrar } from "@ngfi/functions";

import { CMI5CourseCompletionHandler } from "@app/private/functions/micro-apps/base"; 

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new CMI5CourseCompletionHandler();

export const cmi5CourseCompletion = new ConvLearnFunction('cmi5CourseCompletion', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();