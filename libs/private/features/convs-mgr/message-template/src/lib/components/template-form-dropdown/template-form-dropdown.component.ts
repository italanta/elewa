import { Component, EventEmitter, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-template-form-dropdown',
  templateUrl: './template-form-dropdown.component.html',
  styleUrls: ['./template-form-dropdown.component.scss'],
})
export class TemplateFormDropdownComponent implements OnChanges{
  isDropdownOpen = false;

  channels: string[] = ['WhatsApp', 'Messenger'];
  categories: string[] = ['Authentication', 'Marketing', 'Utility'];
  languages: string[] = ['English (en)', 'Spanish (es)', 'Swahili (sw)'];

  selectedOptions: DropdownOptions = {
    channel: '',
    category: '',
    language: ''
  };
  @Output() selectedOptionsChange = new EventEmitter<DropdownOptions>();

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  emitSelectedOptions() {
    this.selectedOptionsChange.emit(this.selectedOptions);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOptions']) {
      this.emitSelectedOptions();
    }
  }
}
export interface DropdownOptions {
  channel: string;
  category: string;
  language: string;
}
