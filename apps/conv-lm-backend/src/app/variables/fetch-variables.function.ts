import { RestRegistrar } from "@ngfi/functions";
import { fetchBlockVariables } from "@app/functions/convs-mgr/variables/block-variables";
import { ConvLearnFunction } from "../../conv-learn-func.class";

const handler = new fetchBlockVariables();

/**
 * @Description : When an end user selects a bot the function is triggered and the variables for the blocks in that bot are fetched. 
 */
export const fetchBlockVariablesFn = new ConvLearnFunction('fetch-block-variables-fn', 
                                                  new RestRegistrar(),   
                                                  [], 
                                                  handler)
                               .build();