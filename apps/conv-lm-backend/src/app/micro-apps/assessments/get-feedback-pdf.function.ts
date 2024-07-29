import { RestRegistrar } from "@ngfi/functions";

import { GetFeedbackPDFHandler } from "@app/private/functions/micro-apps/base";

import { ConvLearnFunction } from "../../../conv-learn-func.class";


const handler = new GetFeedbackPDFHandler();

export const getFeedbackPDF = new ConvLearnFunction('getFeedbackPDF', 
                                                  new RestRegistrar('asia-south1'), 
                                                  [], 
                                                  handler)
                               .build();
