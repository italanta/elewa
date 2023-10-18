import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Label, LabelsStateService } from '@app/state/convs-mgr/stories';
import { Observable } from 'rxjs';

@Component({
  selector: 'italanta-apps-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss'],
})
export class LabelsComponent implements OnInit {
  labels$: Observable<Label[]>;

  newLabelForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _labelsService: LabelsStateService
  ) {}

  ngOnInit(): void {
    this.buildLabelForm();
    this.labels$ = this._labelsService.getLabels();
  }

  buildLabelForm() {
    this.newLabelForm = this._fb.group({
      name: [''],
      color: [''],
      desc: ['']
    });
  }

  createLabel() {
    const formData = this.newLabelForm.value;

    const label: Label = {
      name: formData.name,
      color: formData.color,
      desc: formData.desc
    };

    this._labelsService.createLabel(label).subscribe(() => {
      console.log('success');
    });
  }
}
