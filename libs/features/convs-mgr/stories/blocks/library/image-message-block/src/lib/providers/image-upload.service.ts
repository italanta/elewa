import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { provideStorage,getStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  constructor(private http: HttpClient) { }

  baseURL = "https://image-file.io"

  upload(file: File): Observable<any> 
  {
    
    let formData = new FormData();
    formData.append('image', file.name);
    return this.http.post(this.baseURL, formData);
  }

}
