import { RestRegistrar } from "@ngfi/functions";

import { AssessmentResultHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new AssessmentResultHandler();

export const getAssessmentResults = new ConvLearnFunction('getAssessmentResults', 
                                                  new RestRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();
