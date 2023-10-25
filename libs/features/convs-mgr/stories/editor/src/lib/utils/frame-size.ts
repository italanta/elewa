// This file consists a set of consts to do with the story editor frame size.
//
// Adjustments made to this file will need to be reflected in CSS as well at the editor-frame
// @see libs/features/convs-mgr/stories/editor/src/lib/components/editor-frame/editor-frame.component.scss
//

/** Width in pixels of the story editor */
export const STORY_EDITOR_WIDTH = 5000;
/** Height in pixels of the story editor. Uses a 4:3 frame rate. */
export const STORY_EDITOR_HEIGHT = 3750;

/** Width in pixels of the mini map */
export const MINI_MAP_WIDTH = 200;
/** Width in pixels of the mini map */
export const MINI_MAP_HEIGHT = 150;

/** How many pixels a single pixel on the mini map represents at the story editor level */
export const MINI_MAP_FACTOR = STORY_EDITOR_WIDTH/MINI_MAP_WIDTH;
