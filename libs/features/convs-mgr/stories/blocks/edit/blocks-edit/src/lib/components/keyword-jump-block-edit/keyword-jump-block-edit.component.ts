import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ButtonsBlockButton } from '@app/model/convs-mgr/stories/blocks/scenario';

@Component({
  selector: 'app-keyword-jump-block-edit',
  templateUrl: './keyword-jump-block-edit.component.html',
  styleUrls: ['./keyword-jump-block-edit.component.scss'],
})
export class KeywordJumpBlockEditComponent<T> {
  @Input() form: FormGroup;
  @Input() title: string;

  constructor(private _fb: FormBuilder) {}

  get keywordItems(): FormArray {
    return this.form.controls['options'] as FormArray;
  }

  addKeywordOptions(keywordItem?: ButtonsBlockButton<T>) {
    return this._fb.group({
      id: [keywordItem?.id ?? `${this.keywordItems.value.id}-${this.keywordItems.length + 1}`],
      message: [keywordItem?.message ?? ''],
      value: [keywordItem?.value ?? ''],
    });
  }

  addNewOption() {
    this.keywordItems.push(this.addKeywordOptions());
  }

  deleteInput(i: number) {
    this.keywordItems.removeAt(i);
  }
}
