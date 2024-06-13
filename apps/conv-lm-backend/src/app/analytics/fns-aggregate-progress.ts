import { RestRegistrar } from "@ngfi/functions";

import { AggregateProgressHandler } from "@app/private/functions/analytics/progress/main";

import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new AggregateProgressHandler();

/**
 * @Description : Aggregate progress from all the orgs into a single collection 
 * 
 */
export const aggregateProgress 
  = new ConvLearnFunction('aggregateProgress', 
                          new RestRegistrar({ region: 'asia-south1' }), 
                          [], 
                          handler)
      .build();