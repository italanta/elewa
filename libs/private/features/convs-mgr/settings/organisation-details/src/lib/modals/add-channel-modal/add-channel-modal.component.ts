import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-channel-modal',
  templateUrl: './add-channel-modal.component.html',
  styleUrls: ['./add-channel-modal.component.scss'],
})
export class AddChannelModalComponent {
  selectedPlatform: string | null = null;
  showWhatsAppForm = false;
  showMessengerForm = false;
  showOptionBoxes = true;
  continueButtonText = 'Continue';

  constructor(
    private _dialog: MatDialog,
  ){}


  showForm() {
    if (this.selectedPlatform === 'WhatsApp') {
      this.showWhatsAppForm = true;
      this.showMessengerForm = false;
      this.showOptionBoxes = false;
      this.continueButtonText = 'Add Channel';
    } else if (this.selectedPlatform === 'Messenger') {
      this.showWhatsAppForm = false;
      this.showMessengerForm = true;
      this.showOptionBoxes = false;
      this.continueButtonText = 'Add Channel';
    }
  }
  

  closeModal() {
    this._dialog.closeAll();
  }
}
