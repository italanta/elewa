import { UploadFileService } from './providers/upload-file.service';
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
