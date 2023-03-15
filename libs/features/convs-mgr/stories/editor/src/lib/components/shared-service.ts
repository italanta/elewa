import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _isPublished = new BehaviorSubject<boolean>(false);
  isPublished$ = this._isPublished.asObservable();

  private readonly _isPublishedStorageKey = 'isPublished';
   
 
  constructor() { 
       // we retrieve the value of isPublished from localStorage
       const storedIsPublished = localStorage.getItem(this._isPublishedStorageKey);
       if (storedIsPublished) {
         this._isPublished.next(JSON.parse(storedIsPublished));
       }
  }

  setPublishedStatus(isPublished: boolean) {
    this._isPublished.next(isPublished); 
    //update the value of _isPublished and also store it in localStorage.
    localStorage.setItem(this._isPublishedStorageKey, JSON.stringify(isPublished));
  }
}
