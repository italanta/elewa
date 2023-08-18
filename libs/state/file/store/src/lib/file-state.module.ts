import { UploadFileService } from './providers/upload-file.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileStorageService } from './providers/file-storage.service';
import { CMI5BlockService } from './providers/cmi5-block.service';

@NgModule({
  imports: [
    CommonModule
  ],

  providers: [
    UploadFileService,
    FileStorageService,
    CMI5BlockService
  ]

})
export class FileStateModule {}
