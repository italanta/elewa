import { Component } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ChannelFormModalComponent } from '../channel-form-modal/channel-form-modal.component';

@Component({
  selector: 'app-add-channel-modal',
  templateUrl: './add-channel-modal.component.html',
  styleUrls: ['./add-channel-modal.component.scss'],
})
export class AddChannelModalComponent {
  selectedPlatform: string ;
 
  constructor(
    private _dialog: MatDialog,
    private fb: FormBuilder
  ){
  
  }


  showForm() {
    // Check if a platform is selected
    if (this.selectedPlatform) {
      // Pass the selected platform as data to the modal
      this._dialog.open(ChannelFormModalComponent, {
        minWidth: '30%',
        minHeight: '21.125rem',
        data: { selectedPlatform: this.selectedPlatform }, // Pass the selected platform as data
      });
    }
  }
  

  closeModal() {
    this._dialog.closeAll();
  }
}
