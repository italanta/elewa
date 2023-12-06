import { RestRegistrar } from "@ngfi/functions";
import { FetchBlockVariables } from "@app/functions/convs-mgr/variables/block-variables";
import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new FetchBlockVariables();

/**
 * @Description : When an end user selects a bot the function is triggered and the variables for the blocks in that bot are fetched. 
 */
export const fetchVariables = new ConvLearnFunction('fetch-block-variables', 
                                                  new RestRegistrar(),  
                                                  [], 
                                                  handler)
                               .build();