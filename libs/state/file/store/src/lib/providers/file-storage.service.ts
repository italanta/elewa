import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';

import { catchError, combineLatest, last, map, of, startWith, switchMap } from 'rxjs';

import { Bot } from '@app/model/convs-mgr/bots';
import { ErrorPromptModalComponent } from '@app/elements/layout/modals';
import { WhatsappUploadFileService } from '@app/state/file/whatsapp';
import { CommunicationChannelService } from '@app/state/convs-mgr/channels';

import { FILE_LIMITS, OLD_FILE_LIMITS } from '../model/platform-file-size-limits';
import { FileLimits } from '../model/file-limits.interface';

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
    const filelimits = OLD_FILE_LIMITS[type as keyof typeof OLD_FILE_LIMITS] as any[];

    const limitsViolated = filelimits.filter((limit: any) => {
      return size > this.__convertedSize(limit.size, limit.unit);
    })

    return limitsViolated;
  }

  checkSupportedLimits(size: number, fileType: string, category: keyof FileLimits) {
    // Access the specific file limit for the given category under WhatsApp
    const fileLimit = FILE_LIMITS.whatsapp[category];
  
    // Check if the file size exceeds the limit
    const sizeLimitExceeded = size > this.__convertedSize(fileLimit.size, fileLimit.unit);
  
    // Check if the file type is allowed
    const typeNotAllowed = !fileLimit.types.includes(fileType);
  
    // Return an object with the violation details and the desired file size limit
    if (sizeLimitExceeded || typeNotAllowed) {
      return {
        sizeLimitExceeded,
        typeNotAllowed,
        desiredSizeLimit: {
          size: fileLimit.size,
          unit: fileLimit.unit,
        },
        allowedTypes: fileLimit.types,
      };
    }
  
    // Return null if no violations are found
    return null;
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

    /**
   * Uploads a single file to the specified path in Firebase Storage and returns
   * an observable that emits the upload progress and download URL.
   * 
   * @param file - The file to be uploaded.
   * @param filePath - The destination path in Firebase Storage where the file will be stored(name of file as well).
   * @returns An observable that emits an object containing the upload progress, download URL, and file path.
   */
  async uploadSingleFileAndPercentage(file: File, filePath: string) {
    const customMetadata = { app: 'ele-convs-mgr' };

    // Reference to the storage location
    const taskRef = this._afS$$.ref(filePath);
    
    // Upload the file with custom metadata
    const task = taskRef.put(file, { customMetadata });

    // Observable tracking the percentage changes of the upload
    const taskPercentage = task.percentageChanges().pipe(
      startWith(0) // Start with 0 to ensure the progress bar shows from the beginning
    );

    // Observable to get the download URL after the upload completes
    const downloadURL$ = task.snapshotChanges().pipe(
      last(), // Wait until the last emission from snapshotChanges, indicating completion
      switchMap(() => taskRef.getDownloadURL()), // Fetch the download URL after completion
      catchError(() => of(null)) // Return null in case of any errors
    );

    // Combine the progress and download URL into a single observable output
    return combineLatest([taskPercentage, downloadURL$.pipe(startWith(null))]).pipe(
      map(([progress, downloadURL]) => ({
        progress: progress || 0, // Default progress to 0 if undefined
        downloadURL, // URL of the uploaded file, null if not available yet
        filePath // Path where the file was uploaded
      }))
    );
  } 

}
