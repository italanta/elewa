import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiLangModule } from '@ngfi/multi-lang';

import { ToastComponent } from './components/toast/toast.component';


@NgModule({
  imports: [CommonModule, MultiLangModule],
  declarations: [ToastComponent],
  exports:[ToastComponent]
})
export class ToastModule {}
