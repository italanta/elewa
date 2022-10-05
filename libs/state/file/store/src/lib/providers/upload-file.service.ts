import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Repository, DataService } from '@ngfi/angular';

import { of } from 'rxjs';
import { finalize, switchMap, map, tap, take } from 'rxjs/operators';

import { Logger } from '@iote/bricks-angular';
// ./../../../../../convs-mgr/stories/blocks/src/lib/stores/story-blocks.store
import { StoryBlocksStore } from '@app/state/convs-mgr/stories/blocks';

import { Organisation } from '@app/model/organisation'
import { StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';
import { FileMessageBlock } from '@app/model/convs-mgr/stories/blocks/messaging';

import { ActiveOrgStore } from '@app/state/organisation';

import { FileUpload } from '../model/file-upload.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {
  protected store = 'file-store';

  protected _activeRepo: Repository<FileUpload>;
  org: Organisation;
  imageLink: string;



  constructor(
    private _storyBlockService$: StoryBlocksStore,
    private _org$$: ActiveOrgStore,
    private _repoFac: DataService,
    _logger: Logger,
    private _ngfiStorage: AngularFireStorage,
    private document: AngularFirestore) { }



  upload(block: FileUpload, url: string, blockType: StoryBlockTypes, form: FormGroup, id: string) {


    const fileBlock:FileUpload = {
      fileId: id,
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
          return this._activeRepo.create(fileBlock);
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


  }

  private _updateSrc(blockId: string, url: string){
    const fileBlock = this._storyBlockService$.getOne(blockId);
    return fileBlock.pipe(tap((block)=>{
      let newBlock: FileMessageBlock = {
        ...block as FileMessageBlock,
        fileSrc: url
      }
      this._storyBlockService$.update(newBlock).pipe(take(1)).subscribe();
    }))
  }

  public uploadFile(file: File, block: FileUpload, blockType: StoryBlockTypes, form: FormGroup, id: string): any {

    
    var imgFilePath = `images/${file.name}_${new Date().getTime()}`;
    const imgFileRef = this._ngfiStorage.ref(imgFilePath);
    const uploadTask = this._ngfiStorage.upload(imgFilePath, file);
    


    uploadTask.snapshotChanges().pipe(finalize(() => {
      imgFileRef.getDownloadURL().subscribe((url: string) => {  
        this.imageLink = url
        console.log(form.value.fileSrc);
        this._updateSrc(block.id as string, this.imageLink).pipe(take(1)).subscribe()
        this.upload(block, url, blockType, form, id);
      })
    })
    ).subscribe();
  }


}
