import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

import { Assessment } from '@app/model/convs-mgr/conversations/assessments';

import { AssessmentResultsService } from '@app/state/convs-mgr/conversations/assessments';

import { iTalBreadcrumb } from '@app/model/layout/ital-breadcrumb';
import { AssessmentResult, AssessmentStatusTypes, AssessmentUserResults } from '@app/model/convs-mgr/micro-app/assessments';

@Component({
  selector: 'app-assessment-results',
  templateUrl: './assessment-results.component.html',
  styleUrls: ['./assessment-results.component.scss'],
})
export class AssessmentResultsComponent implements OnInit, OnDestroy {
  id: string;
  @Input() assessment: Assessment;

  assessmentResults: AssessmentResult;
  assessmentUserResults: AssessmentUserResults[];

  itemsLength: number;
  pageTitle: string;

  breadcrumbs$: Observable<iTalBreadcrumb[]>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _sBs = new SubSink();

  constructor(private _assessmentResultsSvc$: AssessmentResultsService
  ) {
  }

  ngOnInit() {
    this.getResults();
  }

  getResults() {
  //  this._sBs.sink = this._assessmentResultsSvc$.getResults(this.assessment.id as string)
  //                     .subscribe((resp)=> {
  //                       if(resp.success) {
  //                         this.assessmentResults = resp.results;
  //                         console.log(this.assessmentResults)
  //                       } else {
  //                         console.error(resp.error)
  //                       }
  //                     })

  // this._sBs.sink = this._assessmentResultsSvc$.getUsers(this.assessment.id as string)
  //                   .subscribe((resp)=> {
  //                     if(resp.success) {
  //                       this.assessmentUserResults = resp.results;
  //                     } else {
  //                       console.error(resp.error)
  //                     }
  //                   })  
  
  this.assessmentResults = dummyAssessmentResult;
  this.assessmentUserResults = dummyAssessmentUserResults
                    
  }

  ngOnDestroy() {
    this._sBs.unsubscribe();
  }
}

const dummyAssessmentResult: AssessmentResult = {
  lowestScore: 45,
  highestScore: 98,
  averageScore: 72,
  averageTimeToCompletion: 5400000, // 1.5 hours in milliseconds
  pieChartData: {
    done: 120,
    inProgress: 30,
  },
  barChartData: [
    { range: "0-10", count: 5 },
    { range: "11-20", count: 10 },
    { range: "21-30", count: 15 },
    { range: "31-40", count: 20 },
    { range: "41-50", count: 25 },
    { range: "51-60", count: 30 },
    { range: "61-70", count: 25 },
    { range: "71-80", count: 20 },
    { range: "81-90", count: 15 },
    { range: "91-100", count: 50 },
  ],
};

const dummyAssessmentUserResults: AssessmentUserResults[] = [
  {
    name: "John Doe",
    phoneNumber: "+254712345678",
    dateDone: new Date("2024-07-15"),
    score: 85,
    scoreCategory: AssessmentStatusTypes.Passed,
  },
  {
    name: "Jane Smith",
    phoneNumber: "+254798765432",
    dateDone: new Date("2024-07-16"),
    score: 72,
    scoreCategory: AssessmentStatusTypes.Passed,
  },
  {
    name: "Hubo Johnson",
    phoneNumber: "+254701234567",
    dateDone: new Date("2024-07-17"),
    score: 65,
    scoreCategory: AssessmentStatusTypes.Passed,
  },
  {
    name: "Bob Brown",
    phoneNumber: "+254712345679",
    dateDone: new Date("2024-07-18"),
    score: 50,
    scoreCategory: AssessmentStatusTypes.Failed,
  },
  {
    name: "Charlie Davis",
    phoneNumber: "+254798765431",
    dateDone: new Date("2024-07-19"),
    score: 30,
    scoreCategory: AssessmentStatusTypes.Failed,
  },
];
