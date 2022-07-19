import { Router } from "@angular/router";
import { Breadcrumb } from "@iote/bricks-angular";

export const HOME_CRUMB = (router: Router, active = false) => (
{  
  label: 'home', // TODO: multi-lang
  callback: () => router.navigate(['/']),
  active
} as Breadcrumb);