import { EndpointRegistrar } from "@ngfi/functions";

import { CMI5CompletionHandler } from "@app/private/functions/micro-apps/cmi5-course-completion";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new CMI5CompletionHandler;

export const cmi5Listener= new ConvLearnFunction('cmi5CourseCompletion', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();