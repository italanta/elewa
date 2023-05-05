import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

@Component({
  selector: 'app-list-block-edit',
  templateUrl: './list-block-edit.component.html',
  styleUrls: ['./list-block-edit.component.scss'],
})
export class ListBlockEditComponent {
  @Input() form: FormGroup
  @Input() title: string

  constructor(private _fb: FormBuilder){}

  get options(): FormArray {
    return this.form.controls['options'] as FormArray
  }

  addListOptions(option?: ButtonsBlockButton<any>){
    return this._fb.group({
      id: [option?.id ?? `${this.form.value}-${this.options.length + 1}`],
      message: [option?.message ?? ''],
      value: [option?.value ?? ''],
    })
  }

  addNewOption() {
    this.options.push(this.addListOptions());
  }

  deleteInput(i: number) {
    this.options.removeAt(i);
  }
}
