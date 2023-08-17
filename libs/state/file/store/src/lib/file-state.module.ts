import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileStorageService } from './providers/file-storage.service';

@NgModule({
  imports: [
    CommonModule
  ],

  providers: [
    FileStorageService
  ]

})
export class FileStateModule {}
