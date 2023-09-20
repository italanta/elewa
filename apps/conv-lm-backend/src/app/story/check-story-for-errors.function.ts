import { RestRegistrar } from "@ngfi/functions";

import { FindStoryErrorHandler } from "@app/functions/convs-mgr/story-editor//check-story-for-errors";

import { ConvLearnFunction } from "../../conv-learn-func.class";

const checkStoryForErrorsHandler = new FindStoryErrorHandler();

/**
 * @Description : When an end user saves a story , this function is triggered, 
 *      then it checks the errors in the blocks and connections
 * 
 */
export const checkStoryErrors = new ConvLearnFunction( 'checkStoryErrors',
                                                    new RestRegistrar(),
                                                    [],
                                                    checkStoryForErrorsHandler)
                                                    .build()



