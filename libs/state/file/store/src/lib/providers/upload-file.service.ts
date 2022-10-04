import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Repository, DataService } from '@ngfi/angular';

import { of } from 'rxjs';
import { finalize, switchMap, map, tap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation'
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveOrgStore } from '@app/state/organisation';

import { FileUpload } from '../model/file-upload.interface';
import { stringify } from 'querystring';
import { url } from 'inspector';
import { getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  protected store = 'file-store';

  protected _activeRepo: Repository<FileUpload>;
  org: Organisation;
  imageLink: string;


  constructor(private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    _logger: Logger,
    private _ngfiStorage: AngularFireStorage) { }


  upload(block: FileUpload, url: string, blockType: StoryBlockTypes, form: FormGroup) {

    const fileBlock = {
      fileId: block.id,
      filePath: url,
      fileType: blockType,
      size: '3MB'
    };

    this._org$$.get().pipe(
      map((org) => {
        this.org = org;
        return (!!org ?? false)
      }),
      switchMap(org => {
        if (!!org) {
          this._activeRepo = this._repoFac.getRepo<FileUpload>(`orgs/${this.org.id}/files`);
          return this._activeRepo.create(fileBlock)
        } else {
          return of([true]);
        }
      }),
      switchMap((rs) => {
        // this.uploadFile(file);
        return of([rs])
      })
    ).subscribe(value => {
      return value;
    });
    console.log(url);
    form.controls['src'].setValue(url);

  }

  public uploadFile(file: File, block: FileUpload, blockType: StoryBlockTypes, form:FormGroup): any {
    var imgFilePath = `images/${file.name}_${new Date().getTime()}`;
    const imgFileRef = this._ngfiStorage.ref(imgFilePath);
    const uploadTask = this._ngfiStorage.upload(imgFilePath, file);
  
    uploadTask.snapshotChanges().pipe(finalize(() => {
      imgFileRef.getDownloadURL().subscribe((url: string) => {
        this.imageLink = url
        this.upload(block, url, blockType, form);  
      })
    })
    ).subscribe();
  }


}
