import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { Observable, take } from 'rxjs';

import { ToastService } from '@iote/bricks-angular';

import { TranslateService } from '@ngfi/multi-lang';

import { Organisation } from '@app/model/organisation';

import { OrganisationService } from '@app/private/state/organisation/main';

import { FileStorageService } from '@app/state/file';

@Component({
  selector: 'update-company-logo-modal',
  templateUrl: './update-company-logo-modal.component.html',
  styleUrls: ['./update-company-logo-modal.component.scss']
})
export class UpdateCompanyLogoModalComponent implements OnInit {
  private _sbS = new SubSink();

  disableBtn = true;

  acceptedFileTypes: string = 'image/png, image/gif, image/jpeg';

  constructor(private _dialogRef: MatDialogRef<UpdateCompanyLogoModalComponent>,
              @Inject(MAT_DIALOG_DATA) public org: Organisation,
              private _fileStorageService$$: FileStorageService,
              private _toastService: ToastService,
              private _trl: TranslateService,
              private _orgService: OrganisationService
  ) {}

  ngOnInit(): void {}

  checkFileExtension(extension: string): boolean {
    return extension == 'png' || 'jpeg' || 'gif' || 'jpg' ? true : false;
  }

  onFileSelected(event: any) {
    const fileName = event.target.files[0].name;

    const fileExtension = fileName.split('.').pop();

    if (this.checkFileExtension(fileExtension)) {
      this.disableBtn = false;
      this.getPhotoUrl(event.target.files[0], fileName);
    } else {
      this.disableBtn = true;
      this._toastService.doSimpleToast(
        this._trl.translate('ALLOWED.FILE.TYPE')
      );
    }
  }

  private async getPhotoUrl (file: File, fileName: string) {
    let uploadPath = `orgs/${this.org.id}/logo/${fileName}`;
    let ref = await this._fileStorageService$$.uploadSingleFile(file, uploadPath);

    this._sbS.sink = ref.pipe(take(1)).subscribe((url) => this.updatePhotoUrl(url));
  }

  onUploadProfilePic() {
    this.exitModal();
  }

  updatePhotoUrl(photoUrl: string) {
    this._orgService.updateOrgDetails(this.org, photoUrl);
  }

  exitModal = () => this._dialogRef.close();

  ngOnDestroy = () => this._sbS.unsubscribe();
}
