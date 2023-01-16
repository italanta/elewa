import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';

import { ScrollableDirective } from './directives/scrollbar.directive';

@NgModule({
  imports: [
    AngularFireModule],

  declarations: [ScrollableDirective],
  exports: [ScrollableDirective]
})
export class InfiniteScrollModule { }
