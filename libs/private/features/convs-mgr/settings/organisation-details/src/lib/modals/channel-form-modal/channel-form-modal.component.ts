import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-form-modal',
  templateUrl: './channel-form-modal.component.html',
  styleUrls: ['./channel-form-modal.component.scss'],
})
export class ChannelFormModalComponent implements OnInit {

  selectedPlatform: string;
  showWhatsAppForm = false;
 
  channelForm: FormGroup;

  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: { selectedPlatform: string }
  ){  }
  ngOnInit(): void {
    this.showForm()
    this.initForm()
  }

  initForm() {
    this.channelForm = this.fb.group({
      botDetails: [''],
      accessToken: ['', Validators.required], 
      botPhoneNumber: [''],
      botPhoneNumberId: [''],
      businessAccountId: [''],
      pageId: [''],
    });
  }



  showForm() {
    // Access the selected platform from the injected data
    if (this.data && this.data.selectedPlatform) {
      this.selectedPlatform = this.data.selectedPlatform;


      if (this.selectedPlatform === 'WhatsApp') {
        this.showWhatsAppForm = true;
      } else {
        this.showWhatsAppForm = false;
      }
    }
  }
  
  onWhatsAppSubmit() {
    if (this.channelForm.valid) {
      // Handle form submission here
     
    }
  }

  onMessengerSubmit(){
    if(this.channelForm.valid){
      //handle messenger submission here 
    }
  }


  closeModal() {
    this._dialog.closeAll();
  }
}
