import { RestRegistrar } from "@ngfi/functions";

import { AggregateProgressHandler } from "@app/private/functions/analytics/progress/main";

import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new AggregateProgressHandler();

/**
 * @Description : M&E of all participants or a single group 
 * 
 */
export const aggregateProgress 
  = new ConvLearnFunction('aggregateProgress', 
                          new RestRegistrar(), 
                          [], 
                          handler)
      .build();