import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';

import { ScrollableDirective } from './directives/scrollbar.directive';

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule],

  declarations: [ScrollableDirective],
  exports: [ScrollableDirective]
})
export class InfiniteScrollModule { }
