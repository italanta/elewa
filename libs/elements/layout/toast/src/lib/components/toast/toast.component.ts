import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit{

  @Input() error?: StoryError;
  @Input() messageType: ToastMessageType = 'success';

  @Input() color: string;
  @Input() iconClass: string;
  @Input() text: string;
  
  @Output() closed = new EventEmitter<void>();
  @Output() scrollTo = new EventEmitter<void>();

  errorType: string;

  ngOnInit(): void {
    if (this.messageType === 'error' && this.error) {
      this.errorType = this.calculateErrorType();
    }
  }

  calculateErrorType(): string {
    if (!this.error) {
      return '';
    }
  
    return this.error.type === StoryErrorType.MissingConnection
      ? 'Missing Connection'
      : this.error.type === StoryErrorType.EmptyTextField
      ? 'Missing Message'
      : '';
  }

  dismissSnackbar(): void {
    this.closed.emit();
  }
  scrollToClick() :void{
    this.scrollTo.emit();
  }
}

export type ToastMessageType = 'error' | 'success';
