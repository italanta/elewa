import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';

import { ToastService } from '@iote/bricks-angular';

import { TranslateService } from '@ngfi/multi-lang';
// import { FileStorageService } from '@ngfi/files';

import { iTalUser } from '@app/model/user';

import { CLMUsersService } from '@app/private/state/user/base';

@Component({
  selector: 'update-profile-picture-modal',
  templateUrl: './update-profile-picture-modal.component.html',
  styleUrls: ['./update-profile-picture-modal.component.scss'],
})
export class UpdateProfilePictureModalComponent implements OnInit {
  private _sbS = new SubSink();

  fileUrl: string;
  downloadURL: Observable<string>;

  n = Date.now();

  filePath = `profileImages/${this.n}`;
  fileRef = this.fireStorage.ref(this.filePath);

  disableBtn = true;

  acceptedFileTypes: string = 'image/png, image/gif, image/jpeg';

  constructor(private _dialogRef: MatDialogRef<UpdateProfilePictureModalComponent>,
              @Inject(MAT_DIALOG_DATA) public userData: iTalUser,
              // private _fileStorage: FileStorageService,
              private _toastService: ToastService,
              private _trl: TranslateService,
              private fireStorage: AngularFireStorage,
              private _userService: CLMUsersService
  ) {}

  ngOnInit(): void {}

  checkFileExtension(extension: string): boolean {
    return extension == 'png' || 'jpeg' || 'gif' || 'jpg' ? true : false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0].name;

    const fileExtension = file.split('.').pop();

    if (this.checkFileExtension(fileExtension)) {
      this.disableBtn = false;
      return this.sendPhoto(event);
    } else {
      this.disableBtn = true;
      this._toastService.doSimpleToast(
        this._trl.translate('ALLOWED.FILE.TYPE')
      );
      return;
    }
  }

  sendPhoto(event: any) {
    // this._sbS.sink = this._fileStorage
    //   .uploadSingleFile(event, this.n)
    //   .subscribe({
    //     complete: () => {
    //       this.downloadURL = this.fileRef.getDownloadURL();
    //       this.downloadURL.subscribe((url) => {
    //         if (url) {
    //           this.fileUrl = url;
    //           this.updatePhotoUrl();
    //         }
    //       });
    //     },
    //   });
  }

  onUploadProfilePic() {
    this.exitModal();
  }

  updatePhotoUrl() {
    this._userService.updateUserPhotoUrl(this.userData, this.fileUrl);
  }

  exitModal = () => this._dialogRef.close();

  ngOnDestroy = () => this._sbS.unsubscribe();
}
