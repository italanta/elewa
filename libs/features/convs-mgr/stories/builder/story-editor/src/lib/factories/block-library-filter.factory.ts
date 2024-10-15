import { BlockLibraryFilterStrategy } from "@app/model/convs-mgr/stories/blocks/main";
import { StoryModuleTypes } from "@app/model/convs-mgr/stories/main";

import { IvrBlockFilterStrategy } from "../models/ivr-block-library-filter-strategy.interface";
import { DefaultBlockFilterStrategy } from "../models/default-block-library-filter-strategy.interface";

/**
 * Factory to create block filtering strategies in the library  based on the story type.
 */
export class BlockFilterFactory {

    /**
     * Returns the appropriate block filter strategy based on the story type.
     * @param {StoryModuleTypes} storyType - The type of the story.
     * @returns {BlockLibraryFilterStrategy} - The block filtering strategy.
     */
    static getFilterStrategy(storyType: StoryModuleTypes): BlockLibraryFilterStrategy {
        switch (storyType) {
            case StoryModuleTypes.IvrModule:
                return new IvrBlockFilterStrategy();
            default:
                return new DefaultBlockFilterStrategy();
        }
    }
}
