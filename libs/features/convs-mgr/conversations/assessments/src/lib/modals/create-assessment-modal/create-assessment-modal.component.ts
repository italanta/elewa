import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SubSink } from 'subsink';
import { tap } from 'rxjs';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentService } from '../../services/assessment.service';



@Component({
  selector: 'convl-italanta-apps-create-assessment-modal',
  templateUrl: './create-assessment-modal.component.html',
  styleUrls: ['./create-assessment-modal.component.scss'],
})
export class CreateAssessmentModalComponent implements OnInit, OnDestroy {
  assessmentForm: FormGroup;
  assessment: Assessment;
  assessmentOrg: string;

  private _sbS = new SubSink();

  isSavingAssessment = false;

  constructor(private _assessment: AssessmentService,
              private _formBuilder: FormBuilder,
              private _route: Router,
              private _dialog: MatDialog){}

  ngOnInit(): void {
    this.createFormGroup();
    this.getAssessmentOrg();
  }

  createFormGroup(){
    this.assessmentForm = this._formBuilder.group({
      assessmentTitle: [''],
      assessmentDesc: ['']
    });
  }

  getAssessmentOrg(){
    this._sbS.sink = this._assessment.getAssessmentOrg$().pipe(tap((_org) => {
      this.assessmentOrg = _org as string
    })).subscribe();
  }

  addAssessment(){
    let assessment: Assessment = {
      title: this.assessmentForm.value.assessmentTitle,
      description: this.assessmentForm.value.assessmentDesc,
      orgId: this.assessmentOrg
    }

    this._sbS.add(
      this._assessment.addAssessment$(assessment).pipe(
        tap((_assessmentSaved) => {
            if(_assessmentSaved) {
              this._dialog.closeAll();
              this._route.navigate(['/assessments', _assessmentSaved.id, 'edit'], {queryParams: {mode: 1}});
            }
          }
        )
      ).subscribe());
  }

  submitAssessment(){
    this.isSavingAssessment = true;
    this.addAssessment();
  }

  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
