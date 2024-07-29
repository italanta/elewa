import { RestRegistrar } from "@ngfi/functions";

import { GetFeedbackHTMLHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new GetFeedbackHTMLHandler();

export const getFeedbackHTML = new ConvLearnFunction('getFeedbackHTML', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
