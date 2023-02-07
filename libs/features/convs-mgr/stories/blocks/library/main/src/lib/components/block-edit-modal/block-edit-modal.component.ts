import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-block-edit-modal',
  templateUrl: './block-edit-modal.component.html',
  styleUrls: ['./block-edit-modal.component.scss'],
})
export class BlockEditModalComponent implements OnInit {
  @Input() EditForm: FormGroup;
  @Input() blockTitle: string;

  ngOnInit() {
    console.log(this.EditForm)
  }
}
