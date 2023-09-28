import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { MultiLangModule } from '@ngfi/multi-lang';


@NgModule({
  imports: [CommonModule, MultiLangModule],
  declarations: [ToastComponent],
  exports:[ToastComponent]
})
export class ToastModule {}
