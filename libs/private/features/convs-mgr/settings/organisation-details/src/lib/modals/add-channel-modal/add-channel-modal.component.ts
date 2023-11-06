import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  channelForm: FormGroup;

  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder
  ){
    // this.channelForm = this.fb.group({
    //   platform: ['', Validators.required], // Example control with validation
    //   botDetails: [''],
    //   accessToken: [''],
    //   phoneNumber: [''],
    //   phoneNumberId: [''],
    //   businessAccountId: [''],
    // });
  }


  showForm() {
    // if (this.channelForm.valid) {
    //   const formData = this.channelForm.value;

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
    
    // }
  
  }
  

  closeModal() {
    this._dialog.closeAll();
  }
}
