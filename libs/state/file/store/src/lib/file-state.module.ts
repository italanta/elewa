import { UploadFileService } from './providers/upload-file.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileStorageService } from './providers/file-storage.service';

@NgModule({
  imports: [
    CommonModule
  ],

  providers: [
    UploadFileService,
    FileStorageService
  ]

})
export class FileStateModule {}
