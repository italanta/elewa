import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  constructor(private _afS$$: AngularFireStorage) { }

  async uploadSingleFile(file: File, filePath: string) {
    const uploadTask = this._afS$$.upload(filePath, file);
    return uploadTask.task.snapshot.ref;
  }

  deleteSingleFile(fileUrl: string) {
    const deleteTask = this._afS$$.refFromURL(fileUrl);
    return deleteTask.delete();
  }
}
