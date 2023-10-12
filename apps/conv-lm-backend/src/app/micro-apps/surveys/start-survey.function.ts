import { RestRegistrar } from "@ngfi/functions";

import { SendSurveyHandler } from "@app/private/functions/micro-apps/surveys";

import { ConvLearnFunction } from "../../../conv-learn-func.class";

const handler = new SendSurveyHandler();

export const sendSurvey = new ConvLearnFunction('sendSurvey', 
                                                  new RestRegistrar(), 
                                                  [], 
                                                  handler)
                               .build();