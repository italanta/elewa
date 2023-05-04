import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-block-edit',
  templateUrl: './list-block-edit.component.html',
  styleUrls: ['./list-block-edit.component.scss'],
})
export class ListBlockEditComponent{
  @Input() form:FormGroup;
  @Input() title: string;

}
