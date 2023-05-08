import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private _videoUrl = new BehaviorSubject<string>('');

  get videoUrl() {
    return this._videoUrl.asObservable();
  }

  setVideoUrl(url: string) {
    this._videoUrl.next(url);
  }
}
