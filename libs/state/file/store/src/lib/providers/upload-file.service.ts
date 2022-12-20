import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';

import { Repository, DataService } from '@ngfi/angular';

import { of } from 'rxjs';
import { switchMap, map, take, catchError } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';

import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';
import { ActiveOrgStore } from '@app/state/organisation';

import { Organisation } from '@app/model/organisation';
import { FileMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';
import { Story } from '@app/model/convs-mgr/stories/main';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

import { FileUpload } from '../model/file-upload.interface';


@Injectable({
  providedIn: 'root'
})

/**This service handles the upload of files on firestorage and firestore*/
export class UploadFileService {

  //The filepath on firestore for the files
  protected _activeRepo: Repository<FileUpload>;
  protected store = 'file-store';

  org: Organisation;
  imageLink: string;

  downloadUrl: string;
  constructor(private _storyBlockService$: StoryBlocksStore,
    private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    private _ngfiStorage: AngularFireStorage,
    _logger: Logger) { }



  /**
   * Function that does the upload of all files
   */
  upload(url: string, block: StoryBlock) {
    //Step 1 - create a descriptor and set its values
    const fileBlock: FileUpload = {
      filePath: url,
      fileType: block.type,
      size: '3MB'
    };


    //Step 2 - get the organisation creating the files
    return this._org$$.get().pipe(take(1),
      map((org) => {
        this.org = org;
      }),
      //Step 3 - create the path in firestore that will lead to files 
      switchMap(org => {
        if (!!this.org) {
          this._activeRepo = this._repoFac.getRepo<FileUpload>(`orgs/${this.org.id}/files`);
          return this._activeRepo.create(fileBlock);

        } else {
          return of([org]);
        }
      }),
      //Step 4 - update The field fileSrc for the block holding the file
      switchMap(() => {
        return this._updateSrc(url, block.id!).pipe(take(1));
      }),
      catchError(err => {
        throw err;
      })
    )


  }
  uploader(url: string, story: Story) {
    //Step 1 - create a descriptor and set its values
    const file: FileUpload = {
      filePath: url,
      size: '3MB'
    };

    //Step 2 - get the organisation creating the files
    return this._org$$.get().pipe(take(1),
      map((org) => {
        this.org = org;
      }),
      //Step 3 - create the path in firestore that will lead to files 
      switchMap(org => {
        if (!!this.org) {
          this._activeRepo = this._repoFac.getRepo<FileUpload>(`orgs/${this.org.id}/files`);
          return this._activeRepo.create(file);
        } else {
          return of([org]);
        }
      })
    )

  }
  /**
   * Updates the blocks src field once the url has been set from firestorage
   */
  private _updateSrc(url: string, id: string) {
    //Step 1 - Get the block in the story that has the same id 
    const fileBlock = this._storyBlockService$.getOne(id)

    //Step 2 - returns the block with the updated fileSrc field 
    return fileBlock.pipe(
      take(1),
      switchMap((block) => {
        const newBlock: FileMessageBlock = {
          ...block as FileMessageBlock,
          fileSrc: url,
        }
        //Step 3 - update the block 
        return this._storyBlockService$.update(newBlock);
      }));
  }

  /**
   * Adds the file on firestorage
   */
  public async uploadFile(file: File, block: StoryBlock, filePath: string) {

    //Step 1 - Upload the file 
    const uploadTask = (await this._ngfiStorage.upload(filePath, file)).ref;

    //Step 2 - Get the url in firebase storage
    const reference = await uploadTask.getDownloadURL();
    //Step 3 - Call the upload function 
    return this.upload(reference, block).pipe(take(1));

  }
  public async FileUploader(file: File, story: Story) {
    //Step 1 - Create the file path that will be in firebase storage
    const imgFilePath = `images/${file.name}_${new Date().getTime()}`;

    //Step 2 - Upload the file 
    const uploadTask = (await this._ngfiStorage.upload(imgFilePath, file)).ref;

    //Step 3 - Get the url in firebase storage
    const reference = await uploadTask.getDownloadURL();

    //Step 4 - Call the upload function 
    return this.uploader(reference, story).pipe(take(1));
  }
}