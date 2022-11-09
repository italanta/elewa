import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

/**
 * This block sends a loction as a message to thee user.
 */
export interface LocationMessageBlock extends StoryBlock
{

    /**Stores the location in longitude and latitude pairs */
    locationInput?: Location;

    /**Stores the default Target if location cannot be found or is invalid */
    defaultTarget?:string;

}


export interface Location {
    /**Stores the longitude */
    longitude:string;
    /**Stores the latitude */
    latitude:string;
    /**Name of the location */
    name?:string;
    /**Address of the location e.g. street address */
    address?:string;
}