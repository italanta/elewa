// This file consists a set of consts to do with the story editor frame size.
//
// Adjustments made to this file will need to be reflected in CSS as well at the editor-frame
// @see libs/features/convs-mgr/stories/editor/src/lib/components/editor-frame/editor-frame.component.scss
//

/** Max zoom out of the frame */
export const MAX_ZOOM_LEVEL = 0.25;

/** Width in pixels of the story editor */
export const STORY_EDITOR_WIDTH = 5000;
/** Min width of the story editor assuming max applied zoom of 0.25 */
export const MIN_STORY_EDITOR_WIDTH = STORY_EDITOR_WIDTH * MAX_ZOOM_LEVEL;

/** Height in pixels of the story editor. Uses a 4:3 frame rate. */
export const STORY_EDITOR_HEIGHT = 3750;
/** Min heifht of the story editor assuming applied zoom */
export const MIN_STORY_EDITOR_HEIGHT = STORY_EDITOR_HEIGHT * MAX_ZOOM_LEVEL;

/** Width in pixels of the mini map */
export const MINI_MAP_WIDTH = 100;
/** Width in pixels of the mini map */
export const MINI_MAP_HEIGHT = 75;

/** How many pixels a single pixel on the mini map represents at the story editor level */
export const MINI_MAP_FACTOR = STORY_EDITOR_WIDTH/MINI_MAP_WIDTH;
