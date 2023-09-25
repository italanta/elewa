import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';
import { ToastMessageType, ToastStatus } from '@app/model/layout/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit{

  @Input() error?: StoryError;
  @Input() messageType: ToastStatus = { type: ToastMessageType.Success};

  @Input() color: string;
  @Input() iconClass: string;
  @Input() text: string;
  
  @Output() closed = new EventEmitter<void>();
  @Output() scrollTo = new EventEmitter<void>();

  errorType: string;
  errorToast: ToastStatus = {type: ToastMessageType.Error}

  ngOnInit(): void {
    if (this.messageType.type === 'error' && this.error) {
      this.errorType = this.getErrorType();
    }
  }

  getErrorType(): string {
    if (!this.error) {
      return '';
    }
  
    switch (this.error.type) {
      case StoryErrorType.MissingConnection:
        return 'Missing Connection';
      
      case StoryErrorType.EmptyTextField:
        return 'Missing Message';
      
      default:
        return '';
    }
  }
  

  dismissSnackbar(): void {
    this.closed.emit();
  }
  scrollToClick() :void{
    this.scrollTo.emit();
  }
}

