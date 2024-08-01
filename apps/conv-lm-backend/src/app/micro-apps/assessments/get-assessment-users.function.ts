import { RestRegistrar } from "@ngfi/functions";

import { AssessmentUsersHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new AssessmentUsersHandler();

export const getAssessmentUsers = new ConvLearnFunction('getAssessmentUsers', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
