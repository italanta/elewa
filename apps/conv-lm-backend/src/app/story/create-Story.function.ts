import { RestRegistrar } from "@ngfi/functions";

import { SaveStoryHandler } from "@app/functions/convs-mgr/story-editor/create-story";

import { ConvLearnFunction } from "../../conv-learn-func.class";

// this is a backend function that is used to save blocks and connections to firebase firestore database storage
const saveStoryHandler = new SaveStoryHandler();


export const saveStory = new ConvLearnFunction( 'saveStory',
                                                    new RestRegistrar(),
                                                    [],
                                                    saveStoryHandler)
                                                    .build()




                                               