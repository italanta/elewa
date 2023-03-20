import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CommunicationChannel } from '@app/model/convs-mgr/conversations/admin/system';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private _isPublished = new Subject<CommunicationChannel>();
  isPublished$ = this._isPublished.asObservable();

  // private readonly _isPublishedStorageKey = 'isPublished';
   
 
  constructor() { 
       // we retrieve the value of isPublished from localStorage
    
         
       
  }

  setPublishedStatus(isPublished: CommunicationChannel) {
    this._isPublished.next(isPublished); 
    //update the value of _isPublished and also store it in localStorage.
   
  }
}
