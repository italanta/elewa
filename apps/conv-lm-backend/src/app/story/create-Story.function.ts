import { RestRegistrar } from "@ngfi/functions";

import { SaveStoryHandler } from "@app/functions/convs-mgr/story-editor/create-story";

import { ConvLearnFunction } from "../../conv-learn-func.class";

const saveStoryHandler = new SaveStoryHandler();


export const saveStory = new ConvLearnFunction( 'saveStory',
                                                    new RestRegistrar(),
                                                    [],
                                                    saveStoryHandler)
                                                    .build()




                                               