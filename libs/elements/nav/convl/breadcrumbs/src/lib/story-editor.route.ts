import { Router } from "@angular/router";
import { Breadcrumb } from "@iote/bricks-angular";

/** Breadcrumb for the story editor page */
export const STORY_EDITOR_CRUMB = (router: Router, storyId: string | undefined, storyName: string, active = false) => (
{  
  label: storyName, // TODO: multi-lang
  callback: () => router.navigate(['stories', storyId]),
  active
} as Breadcrumb);