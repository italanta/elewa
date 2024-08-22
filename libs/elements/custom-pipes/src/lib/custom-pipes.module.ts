import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformPipe } from './platform.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [PlatformPipe],
  exports: [PlatformPipe]
})
export class CustomPipesModule {}
