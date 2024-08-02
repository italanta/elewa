import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';

import { combineLatest, finalize, map, of, switchMap } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';
import { ErrorPromptModalComponent } from '@app/elements/layout/modals';
import { WhatsappUploadFileService } from '@app/state/file/whatsapp';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { FILE_LIMITS } from '../model/platform-file-size-limits';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService
{

  constructor(private _afS$$: AngularFireStorage,
    private dialog: MatDialog,
    private _whatsappUploadFileService: WhatsappUploadFileService,
    private channelService: CommunicationChannelService,
  ) { }

  async uploadSingleFile(file: File, filePath: string) {
    const customMetadata = { app: 'ele-convs-mgr' };

    const taskRef = this._afS$$.ref(filePath);
    await taskRef.put(file, { customMetadata });

    return taskRef.getDownloadURL();
  }

  deleteSingleFile(fileUrl: string) {
    const deleteTask = this._afS$$.refFromURL(fileUrl);
    return deleteTask.delete();
  }

  openErrorModal(title: string, message: string) {
    this.dialog.open(ErrorPromptModalComponent, {
      width: '400px',
      data: {
        title,
        message
      }
    });
  }

  checkFileSizeLimits(size: number, type: string) { 
    const filelimits = FILE_LIMITS[type as keyof typeof FILE_LIMITS] as any[];

    const limitsViolated = filelimits.filter((limit: any) => {
      return size > this.__convertedSize(limit.size, limit.unit);
    })

    return limitsViolated;
  }

  private __convertedSize(size: number, unit: string) {
    if (unit === 'KB') {
      return size;
    } else {
      return size * 1024;
    }
  }

  uploadMediaToPlatform(bot: Bot)
  {
    return this.channelService.getSpecificChannel(bot.linkedChannel as string).pipe(switchMap((channel)=> {
      if (channel) {
        return this._whatsappUploadFileService.uploadMedia(bot, channel);
      } else {
        return of(null);
      }
    }))
  }

  async uploadSingleFileAndPercentage(file: File, filePath: string) {
    const customMetadata = { app: 'ele-convs-mgr' };
  
    const taskRef = this._afS$$.ref(filePath);
    const task = taskRef.put(file, { customMetadata });
  
    const taskPercentage = task.percentageChanges();
  
    const downloadURL$ = task.snapshotChanges().pipe(
      finalize(async () => {
        const url = taskRef.getDownloadURL()
        return url;
      })
    );
  
    // Combine the progress and file path with download URL into a single observable
    return combineLatest([taskPercentage, downloadURL$]).pipe(
      map(([progress, downloadURL]) => ({ progress: progress || 0, downloadURL, filePath }))
    );
  }
}
