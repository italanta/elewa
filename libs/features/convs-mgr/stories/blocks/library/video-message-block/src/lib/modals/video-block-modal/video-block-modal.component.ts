import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-video-block-modal',
  templateUrl: './video-block-modal.component.html',
  styleUrls: ['./video-block-modal.component.css']
})
export class VideoBlockModalComponent {

  @Output() applied = new EventEmitter<any>();
  title = 'Upload Video';
  name: string;
  video: File;
  size: string;

  // make this an array of objects, having the size in pixels and given dimensions
  sizeOptions = ['360p', '480p', '720p (Reccomeneded)', '1080p', '4K'];;

  onVideoChange(event: any) {
    this.video = event.target.files[0];
  }

  apply() {
    const videoBlock = {
      name: this.name,
      video: this.video,
      size: this.size
    };
    this.applied.emit(videoBlock);
  }
}
