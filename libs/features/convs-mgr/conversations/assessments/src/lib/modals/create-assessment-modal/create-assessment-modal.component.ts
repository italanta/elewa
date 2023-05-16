import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

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
              private _route: Router,
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
        this._route.navigate(['/assessments', _assessmentSaved.id, 'edit'], {queryParams: {mode: 1}});
      }
    });
  }

  submitAssessment(){
    this.isSavingAssessment = true;
    this.addAssessment();
  }
}
