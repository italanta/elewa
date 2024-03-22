import { RestRegistrar } from "@ngfi/functions";

import { MeasureParticipantGroupProgressHandler } from "@app/private/functions/analytics/progress/main";

import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new MeasureParticipantGroupProgressHandler();

/**
 * @Description : M&E of all participants or a single group 
 * 
 */
export const measureGroupProgress 
  = new ConvLearnFunction('measureGroupProgress', 
                          new RestRegistrar(), 
                          [], 
                          handler)
      .build();