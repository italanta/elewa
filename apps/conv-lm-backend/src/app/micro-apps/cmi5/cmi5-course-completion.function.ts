import { EndpointRegistrar } from "@ngfi/functions";

import { CMICourseCompletionHandler } from "@app/private/functions/micro-apps/cmi5-course-completion"; 

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new CMICourseCompletionHandler();

export const cmi5CourseCompletion = new ConvLearnFunction('cmi5CourseCompletion', 
                                                  new EndpointRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();