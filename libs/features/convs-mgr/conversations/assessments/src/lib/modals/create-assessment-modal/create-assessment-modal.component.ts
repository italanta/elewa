import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Assessment } from '@app/model/convs-mgr/conversations/assessments';
import { MatDialog } from '@angular/material/dialog';

import { AssessmentService } from '../../services/assessment.service';

@Component({
  selector: 'convl-italanta-apps-create-assessment-modal',
  templateUrl: './create-assessment-modal.component.html',
  styleUrls: ['./create-assessment-modal.component.scss'],
})
export class CreateAssessmentModalComponent implements OnInit {
  assessmentForm: FormGroup;
  assessment: Assessment;

  isSavingAssessment = false;

  constructor(private _assessment: AssessmentService,
              private _formBuilder: FormBuilder,
              private _dialog: MatDialog){}

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup(){
    this.assessmentForm = this._formBuilder.group({
      assessmentTitle: [''],
      assessmentDesc: ['']
    });
  }

  addAssessment(){
    let assessment: Assessment = {
      title: this.assessmentForm.value.assessmentTitle,
      description: this.assessmentForm.value.assessmentDesc
    }

    this._assessment.addAssessment$(assessment).subscribe(_assessmentSaved => {
      if(_assessmentSaved) {
        this._dialog.closeAll();
      }
    });
  }

  submitAssessment(){
    this.isSavingAssessment = true;
    this.addAssessment();
  }
}
