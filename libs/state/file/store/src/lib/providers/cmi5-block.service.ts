import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

import { from, switchMap } from 'rxjs';

import { UserStore } from '@app/state/user';

import { FileStorageService } from './file-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CMI5BlockService {
  constructor(
    private _aFF: AngularFireFunctions,
    private authService: UserStore,
    private fileStorageService: FileStorageService,
    private dialog: MatDialog
  ) {}

  openDialog(title: string, message: string) {
    this.fileStorageService.openErrorModal(title, message);
  }

  async parseCMI5Zip(
    courseId: string,
    orgId: string,
    file: File,
    filePath: string
  ) {
    const fileName = file.name;

    const downloadUrl = from(
      await this.fileStorageService.uploadSingleFile(file, filePath)
    );
    return downloadUrl.pipe(
      switchMap((url) =>
        this._aFF.httpsCallable('cmi5ZipParser')({
          courseId,
          orgId,
          fileName,
        })
      )
    );
  }
}
