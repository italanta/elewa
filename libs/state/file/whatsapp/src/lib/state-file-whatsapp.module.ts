import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhatsappUploadFileService } from './services/whatsapp-upload-file.service';

@NgModule({
  imports: [CommonModule],
  providers: [WhatsappUploadFileService]
})
export class WhatsappFileModule {}
