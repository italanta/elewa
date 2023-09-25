import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';
import { ToastMessageTypeEnum, ToastStatus } from '@app/model/layout/toast';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit{

  @Input() error?: StoryError;
  @Input() messageType: ToastStatus = { type: ToastMessageTypeEnum.Success};

  @Input() color: string;
  @Input() iconClass: string;
  @Input() text: string;
  
  @Output() closeToast = new EventEmitter<void>();
  @Output() scrollToError = new EventEmitter<void>();

  errorType: string;
  errorToast: ToastStatus = {type: ToastMessageTypeEnum.Error}

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
    this.closeToast.emit();
  }
  scrollToClick() :void{
    this.scrollToError.emit();
  }
}

