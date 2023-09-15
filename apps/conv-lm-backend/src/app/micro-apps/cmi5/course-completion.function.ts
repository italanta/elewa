import { EndpointRegistrar } from "@ngfi/functions";

import { CourseCompleteHandler } from "@app/private/functions/micro-apps/base"; 

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new CourseCompleteHandler();

export const courseComplete = new ConvLearnFunction('courseComplete', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();