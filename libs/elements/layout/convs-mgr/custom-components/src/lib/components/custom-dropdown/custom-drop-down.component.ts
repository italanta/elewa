import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-custom-drop-down',
  templateUrl: './custom-drop-down.component.html',
  styleUrl: './custom-drop-down.component.scss',
})
export class CustomDropDownComponent implements OnInit {
  @Output() selectionChanged = new EventEmitter<any>();
  @Input() options: any[];
  @Input() nameField: any[];
  @Input() valueField: any[];
  @Input() selectedOptionId: string;

  selectedOption: any;
  
  dropdownOpen: boolean;

  ngOnInit() {
    if(this.selectedOptionId) {
      this.selectedOption = this.options.find((op)=> op.id === this.selectedOptionId);
    }
  }
  
  // Toggle the dropdown open/close state
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onOptionSelected(value: any) {
    this.selectedOption = value;
    this.dropdownOpen = false;
    this.selectionChanged.emit(this.selectedOption);
  }
}
