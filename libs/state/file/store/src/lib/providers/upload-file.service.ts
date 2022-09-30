import { Injectable } from '@angular/core';

import { Repository, DataService } from '@ngfi/angular';
import { DataStore } from '@ngfi/state';

import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { Organisation } from '@app/model/organisation'
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { ActiveOrgStore } from '@app/state/organisation';

import { FileUpload } from '../model/file-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService extends DataStore<FileUpload>{
  protected store = 'file-store';

  protected _activeRepo: Repository<FileUpload>;
  private _activeOrg: Organisation;


  constructor(private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    _logger: Logger) { super("always", _logger) }


  upload(block: FileUpload, url: string, blockType: StoryBlockTypes): any {


    const promise$ = new Promise<FileUpload>((resolve) => {
      const fileBlock = {
        fileId: block.id,
        filePath: url,
        fileType: blockType,
        size: '3MB'
      };
      resolve(fileBlock);
    });

    console.log(promise$);

    of(promise$).pipe(switchMap(() => {
      return this._org$$.get()
    })).subscribe(org => {
      this._activeRepo = this._repoFac.getRepo<FileUpload>(`orgs/${org.id}/files/`)
      org ? this._activeRepo.getDocuments() : of([] as FileUpload[])
      this.set(org, 'UPDATE - FROM DB')
    })
  }
}



