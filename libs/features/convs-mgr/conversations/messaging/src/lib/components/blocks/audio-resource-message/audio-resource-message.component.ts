import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

import WaveSurfer from 'wavesurfer.js';

import { FileMessage, Message } from '@app/model/convs-mgr/conversations/messages';

@Component({
  selector: 'app-audio-resource-message',
  templateUrl: './audio-resource-message.component.html',
  styleUrls: ['./audio-resource-message.component.scss'],
})
export class AudioResourceMessageComponent implements AfterViewInit {
  @Input() message: FileMessage;
  private wavesurfer!: WaveSurfer;

  @ViewChild('waveform') waveformElement!: ElementRef;

  ngAfterViewInit() {
    this.initializeWaveSurfer();

    if (this.message.payload?.fileSrc) {
      this.wavesurfer.load(this.message.payload.fileSrc);
    }
  }

  private initializeWaveSurfer(): void {
    this.wavesurfer = WaveSurfer.create({
      container: this.waveformElement.nativeElement,
      waveColor: '#E9E7F4',
      progressColor: '#1F7A8C',
      barWidth: 3,
      height: 30,
      normalize: true,
    });
  }

  playAudio() {
    if (!this.wavesurfer) return;

    if (this.wavesurfer.isPlaying()) {
      this.wavesurfer.pause();
    } else this.wavesurfer.play();
  }

  getClasses(message: Message) {
    if (message.direction === 5 || message.direction === 25) {
      return ['message-content', 'grey'];
    } else {
      return ['message-content', 'green'];
    }
  }

  unPackFileSize(fileSize?: string) {
    if (!fileSize) return;

    return parseInt(fileSize) + ' kB';
  };

  downloadFile(fileSrc?: string) {
    if (!fileSrc) return;

    const newTab = window.open() as Window;
    newTab.location.href = fileSrc;
  };
}
