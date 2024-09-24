import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { StoryError, StoryErrorType } from '@app/model/convs-mgr/stories/main';
import { ToastMessageTypeEnum, ToastStatus } from '@app/model/layout/toast';

/**
 * @description Toast component to display error or success messages.
 * Emits events to close the toast or scroll to an error on click.
 */
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {

  /** Error object containing error details (optional). */
  @Input() error?: StoryError;

  /** Type of the toast message (default is Success). */
  @Input() messageType: ToastStatus = { type: ToastMessageTypeEnum.Success };

  /** Background color of the toast (provided via input). */
  @Input() color: string;

  /** CSS class for the icon shown in the toast. */
  @Input() iconClass: string;

  /** Text content of the toast message (provided via input). */
  @Input() text: string;

  /** Event emitted when the toast is closed. */
  @Output() closeToast = new EventEmitter<void>();

  /** Event emitted when an error is clicked, typically for scrolling to an error field. */
  @Output() scrollToError = new EventEmitter<void>();

  /** Type of the error, if any. */
  errorType: string;

  /** Predefined status for error toast messages. */
  errorToast: ToastStatus = { type: ToastMessageTypeEnum.Error };

  /**
   * Lifecycle hook that initializes the component.
   * Sets the error type if the message is an error.
   */
  ngOnInit(): void {
    if (this.messageType.type === ToastMessageTypeEnum.Error && this.error) {
      this.errorType = this.getErrorType();
    }
  }

  /**
   * Determines the type of error based on the provided `StoryError`.
   * @returns {string} A user-friendly error message.
   */
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

  /**
   * Dismisses the snackbar and emits an event to notify the parent component.
   */
  dismissSnackbar(): void {
    this.closeToast.emit();
  }

  /**
   * Emits an event to scroll to the error section when clicked.
   */
  scrollToClick(): void {
    this.scrollToError.emit();
  }

  /**
   * Determines if the current toast is an error.
   * @returns {boolean} True if the toast is an error, false otherwise.
   */
  isErrorToast(): boolean {
    return this.messageType.type === this.errorToast.type;
  }
}
