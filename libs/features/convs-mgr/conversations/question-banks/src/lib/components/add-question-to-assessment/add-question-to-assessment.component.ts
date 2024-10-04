import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { __DateFromStorage } from '@iote/time';
import { Assessment, AssessmentQuestion } from '@app/model/convs-mgr/conversations/assessments';
import { AssessmentQuestionBankService, AssessmentService } from '@app/state/convs-mgr/conversations/assessments';

@Component({
  selector: 'lib-add-question-to-assessment',
  templateUrl: './add-question-to-assessment.component.html',
  styleUrl: './add-question-to-assessment.component.scss',
})
export class AddQuestionToAssessmentComponent implements OnInit, OnDestroy
{
  /** Table columns */
  assessmentsColumns = [ 'actions', 'title', 'status', 'updatedOn'];
  /** TAble data */
  dataSource = new MatTableDataSource<Assessment>();
  /** An array of available assesments */
  assessments: Assessment[];
  /** An observable stream of assessments  */
  assessments$: Observable<Assessment[]>;
  /** Assessment data loaded */
  hasData: boolean;
  /** State before checkmark is checked */
  noneSelected = true;
  /** Specific question selected*/
  questions: AssessmentQuestion[];
  /** Unique ids of selected assessment IDs*/
  private selectedAssessmentIds$ = new BehaviorSubject<Set<string>>(new Set());


  private _sBS = new SubSink();

  constructor(private _router: Router,
              private _assessmentService: AssessmentService,
              private _dialog: MatDialog,
              private _questionService: AssessmentQuestionBankService,
              private _snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: { question: AssessmentQuestion[] }

  ) {
    this.questions = this.data.question
  }

  ngOnInit(): void 
  {
    this.assessments$ = this._assessmentService.getAssessments$();
    this._sBS.sink = this.assessments$.subscribe((assessments) => { 
      this.dataSource.data = assessments
      this.hasData = true
    })  
  }
  
  openAssessment(assessmentId: string) 
  {
    this._router.navigate(['/assessments', assessmentId]);
  }

  /** Create a new assessment */
  createAssessement()
  {
    this._router.navigate(['/assessments/create'])
    this._dialog.closeAll()
  }
  /** Format date display */
  getFormattedDate(date: Date)
  {
    const newDate = __DateFromStorage(date as Date);
    return newDate.format('DD/MM/YYYY HH:mm');
  }

  get selectedAssessmentIds(): Set<string> {
    return this.selectedAssessmentIds$.getValue();
  }
  
  /** Check bock selected event 
   *  Get the assessment id value 
  */
  onCheckboxChange(event: Event, assessmentId: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const newSelectedAssessmentIds = new Set(this.selectedAssessmentIds$.getValue());
    if (isChecked) {
      newSelectedAssessmentIds.add(assessmentId);
    } else {
      newSelectedAssessmentIds.delete(assessmentId);
    }
    this.selectedAssessmentIds$.next(newSelectedAssessmentIds);
  
    // Update the noneSelected flag based on the size of the new set
    this.noneSelected = newSelectedAssessmentIds.size === 0;
  }
  
 /** Adding questions to an assessment */
  addToAssessment(): void {
    if (this.selectedAssessmentIds.size === 0 || this.questions.length === 0) return;
    const selectedAssessmentIds = Array.from(this.selectedAssessmentIds); 

    // Step 1: Add questions to the assessment
    this._questionService.addMultipleQuestionsToAssessment$(selectedAssessmentIds, this.questions)
      .subscribe({
        next: () => {
          // Step 2: Update the maxScore after questions are added
          this._assessmentService.updateMaxScore$(selectedAssessmentIds, this.questions)
            .subscribe({
              next: () => {
                // Show success message when both adding questions and updating maxScore succeed
                this.showSuccessToast();
                this._dialog.closeAll();
              },
              error: (err) => {
                this._snackBar.open(`Error updating assessment score: ${err.message}`, 'Close', { duration: 3000 });
              }
            });
        },
        error: (err) => {
          this._snackBar.open(`Error updating assessment: ${err.message}`, 'Close', { duration: 3000 });
        }
      });
  }

  showSuccessToast(): void {
    const snackBarRef = this._snackBar.open('Success. Question has been added to assessment', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  
    snackBarRef.onAction().subscribe(() => {
      // Close the snackbar programmatically
      snackBarRef.dismiss();
    });
  }  
  closeDialog(){
    this._dialog.closeAll()
  }

  ngOnDestroy(): void 
  {
      this._sBS.unsubscribe()
  }
}
