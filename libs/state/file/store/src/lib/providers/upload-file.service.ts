import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Repository, DataService } from '@ngfi/angular';

import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation'
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveOrgStore } from '@app/state/organisation';

import { FileUpload } from '../model/file-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService
{
  protected store = 'file-store';

  protected _activeRepo: Repository<FileUpload>;
  private _activeOrg: Organisation;

  org: Organisation;

  constructor(private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    _logger: Logger,
    private _ngfiStorage: AngularFireStorage) { }


  upload(block: FileUpload, url: string, blockType: StoryBlockTypes, file: File) {
      const fileBlock = {
        fileId: block.id,
        filePath: url,
        fileType: blockType,
        size: '3MB'
      };
      

     
    this._org$$.get().pipe(
      map((org) => {
        this.org = org
        return (!!org ?? false)
      }),
      switchMap(org => {
        if(!!org){
          this._activeRepo = this._repoFac.getRepo<FileUpload>(`orgs/${this.org.id}/files`);
          return this._activeRepo.create(fileBlock)
        } else {
          return of([true]);
        }
      }),
      switchMap((rs) => {
        console.log(rs);
        this.uploadFile(file)
        return of([rs])
      })
    ).subscribe(value =>{
      return value;
    });

  }

  public uploadFile(file: any){
    this._ngfiStorage.upload('/files', file);
  }
}



