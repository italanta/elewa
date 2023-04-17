import { RestRegistrar } from "@ngfi/functions";

import { ConvLearnFunction } from "../../conv-learn-func.class";
import { MeasureParticipantGroupProgressHandler } from "@app/functions/analytics/progress/main";

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