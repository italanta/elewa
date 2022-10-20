import { UploadFileService } from '@app/state/file';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],

  providers: [
    UploadFileService
  ]

})
export class FileStateModule {}
