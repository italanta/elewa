import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  constructor(private _afS$$: AngularFireStorage) { }

  async uploadSingleFile(file: File, filePath: string) {
    const customMetadata = { app: 'ele-convs-mgr' };

    let taskRef = this._afS$$.ref(filePath);
    await taskRef.put(file, { customMetadata });

    return taskRef.getDownloadURL();
  }

  deleteSingleFile(fileUrl: string) {
    const deleteTask = this._afS$$.refFromURL(fileUrl);
    return deleteTask.delete();
  }
}
