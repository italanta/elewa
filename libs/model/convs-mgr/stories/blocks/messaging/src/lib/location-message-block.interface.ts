import { StoryBlock } from "@app/model/convs-mgr/stories/blocks/main";

export interface LocationMessageBlock extends StoryBlock{

    /**Stores the location in longitude and latitude pairs */
    locationInput?: Location;

    /**Stores the default Target if location cannot be found or is invalid */
    defaultTarget?:string;

}


interface Location {
    /**Stores the longitude */
    longitude:string;
    /**Stores the latitude */
    latitude:string;
}