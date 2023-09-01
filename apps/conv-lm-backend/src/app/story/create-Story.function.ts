import { RestRegistrar } from "@ngfi/functions";

import { SaveStoryHandler } from "@app/functions/convs-mgr/story-editor/create-story";

import { ConvLearnFunction } from "../../conv-learn-func.class";


/**
 * @Description : When an end user saves a story , this function is triggered, 
 *      save blocks and connections to firebase firestore database storage
 * 
 */
const saveStoryHandler = new SaveStoryHandler();


export const saveStory = new ConvLearnFunction( 'saveStory',
                                                    new RestRegistrar(),
                                                    [],
                                                    saveStoryHandler)
                                                    .build()




                                               